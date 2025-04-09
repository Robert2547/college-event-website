package edu.ucf.college_event_website.config;

import edu.ucf.college_event_website.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;
import java.util.stream.Collectors;


import java.io.IOException;


/**
 * Filter that intercepts every request to validate JWT token
 * This filter runs once per request (hence extends OncePerRequestFilter)
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    // Core filter method that processes each request
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Extract JWT token from the Authorization header
        String jwt = getJwtFromRequest(request);

        // Only process if we have a token and authentication is not already set
        if (StringUtils.hasText(jwt) && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // Extract username from token
                String username = jwtUtil.extractUsername(jwt);

                if (StringUtils.hasText(username)) {
                    // Load user details from database
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    // Validate token
                    if (jwtUtil.validateToken(jwt, userDetails)) {
                        // Create authentication object
                        Claims claims = jwtUtil.extractAllClaims(jwt);
                        List<String> roles = claims.get("roles", List.class);

                        List<GrantedAuthority> authorities = roles.stream()
                                .map(role -> new SimpleGrantedAuthority("ROLE_" + role)) // ✅ Spring requires "ROLE_" prefix
                                .collect(Collectors.toList());


                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

                        // Add request details to authentication
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        // Set authentication in the security context
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } catch (Exception e) {
                logger.error("Could not set user authentication in security context", e);
            }
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " prefix
        }
        return null;
    }
}