package edu.ucf.college_event_website.service;

import edu.ucf.college_event_website.dto.EventResponse;
import edu.ucf.college_event_website.model.Event;
import edu.ucf.college_event_website.model.PublicEvent;
import edu.ucf.college_event_website.model.User;
import edu.ucf.college_event_website.repository.EventRepository;
import edu.ucf.college_event_website.repository.PublicEventRepository;
import edu.ucf.college_event_website.util.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublicEventService {

    @Autowired
    private PublicEventRepository publicEventRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private SecurityUtils securityUtils;

    @Autowired
    private EventService eventService;

    // Get all pending public events
    public List<EventResponse> getPendingPublicEvents() {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Check if user is admin or super admin
        if (!securityUtils.isAdmin()) {
            throw new AccessDeniedException("Only admins can view pending public events");
        }

        // Get pending events
        List<PublicEvent> pendingEvents = publicEventRepository.findByApproved(false);

        // Convert to event responses
        return pendingEvents.stream()
                .map(publicEvent -> eventService.getEventById(publicEvent.getId()))
                .collect(Collectors.toList());
    }

    // Approve a public event
    @Transactional
    public EventResponse approvePublicEvent(Long eventId) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Check if user is admin or super admin
        if (!securityUtils.isAdmin()) {
            throw new AccessDeniedException("Only admins can approve public events");
        }

        // Find public event
        PublicEvent publicEvent = publicEventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Public event not found"));

        // Update approval status
        publicEvent.setApproved(true);
        publicEvent.setSuperAdmin(currentUser);

        // Save updated public event
        publicEventRepository.save(publicEvent);

        // Return updated event response
        return eventService.getEventById(eventId);
    }

    // Reject a public event
    @Transactional
    public void rejectPublicEvent(Long eventId) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Check if user is admin or super admin
        if (!securityUtils.isAdmin()) {
            throw new AccessDeniedException("Only admins can reject public events");
        }

        // Find event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Find public event
        PublicEvent publicEvent = publicEventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Public event not found"));

        // Delete public event
        publicEventRepository.delete(publicEvent);

        // Delete the event
        eventRepository.delete(event);
    }
}