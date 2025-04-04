package edu.ucf.college_event_website.service;

import edu.ucf.college_event_website.dto.EventCreateRequest;
import edu.ucf.college_event_website.dto.EventResponse;
import edu.ucf.college_event_website.dto.EventUpdateRequest;
import edu.ucf.college_event_website.model.*;
import edu.ucf.college_event_website.repository.*;
import edu.ucf.college_event_website.util.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private PrivateEventRepository privateEventRepository;

    @Autowired
    private PublicEventRepository publicEventRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private RsoEventRepository rsoEventRepository;

    @Autowired
    private RsoRepository rsoRepository;

    @Autowired
    private RsoMembershipRepository rsoMembershipRepository;

    @Autowired
    private SecurityUtils securityUtils;

    // Convert Event to EventResponse
    private EventResponse convertToDTO(Event event) {
        EventResponse.LocationDto locationDto = new EventResponse.LocationDto(
                event.getLocation().getId(),
                event.getLocation().getName(),
                event.getLocation().getAddress(),
                event.getLocation().getLatitude().doubleValue(),
                event.getLocation().getLongitude().doubleValue()
        );

        // Get average rating
        Double avgRating = ratingRepository.calculateAverageRating(event.getId());
        if (avgRating == null) avgRating = 0.0;

        // Get comment count
        Integer commentCount = commentRepository.findByEventIdOrderByTimestampDesc(event.getId()).size();

        // Get approval status for public events
        Boolean approved = null;
        if (event.getEventType() == EventType.PUBLIC) {
            PublicEvent publicEvent = publicEventRepository.findById(event.getId()).orElse(null);
            if (publicEvent != null) {
                approved = publicEvent.getApproved();
            }
        }

        return new EventResponse(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getTime(),
                event.getDate(),
                locationDto,
                event.getCreatedBy().getFirstName() + " " + event.getCreatedBy().getLastName(),
                event.getCollege().getName(),
                event.getEventType(),
                event.getContactPhone(),
                event.getContactEmail(),
                avgRating,
                commentCount,
                approved
        );
    }

    // Create a new event
    @Transactional
    public EventResponse createEvent(EventCreateRequest request) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Get college
        College college = collegeRepository.findById(request.getCollegeId())
                .orElseThrow(() -> new EntityNotFoundException("College not found"));

        // Get location
        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new EntityNotFoundException("Location not found"));

        // Create new event
        Event event = new Event();
        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setTime(request.getTime());
        event.setLocation(location);
        event.setDate(request.getDate());
        event.setCollege(college);
        event.setCreatedBy(currentUser);
        event.setEventType(request.getEventType());
        event.setContactEmail(request.getContactEmail());
        event.setContactPhone(request.getContactPhone());

        // Save event to database
        Event savedEvent = eventRepository.save(event);

        switch (request.getEventType()) {
            case PUBLIC:
                createPublicEvent(savedEvent, request, currentUser);
                break;
            case PRIVATE:
                createPrivateEvent(savedEvent, request, currentUser);
                break;
            case RSO:
                createRsoEvent(savedEvent, request, currentUser);
                break;
        }
        // Convert to DTO and return
        return convertToDTO(savedEvent);
    }

    // Update event
    @Transactional
    public EventResponse updateEvent(Long id, EventUpdateRequest request) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Find event
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Check if user owns the event or is an admin
        if (!event.getCreatedBy().getId().equals(currentUser.getId()) &&
                !securityUtils.isSuperAdmin()) {
            throw new AccessDeniedException("You do not have permission to update this event");
        }

        // Get location if changed
        if (request.getLocationId() != null) {
            Location location = locationRepository.findById(request.getLocationId())
                    .orElseThrow(() -> new EntityNotFoundException("Location not found"));
            event.setLocation(location);
        }

        // Update event fields
        if (request.getName() != null) event.setName(request.getName());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getTime() != null) event.setTime(request.getTime());
        if (request.getDate() != null) event.setDate(request.getDate());
        if (request.getContactEmail() != null) event.setContactEmail(request.getContactEmail());
        if (request.getContactPhone() != null) event.setContactPhone(request.getContactPhone());

        // Save updated event
        Event updatedEvent = eventRepository.save(event);

        // Convert to DTO and return
        return convertToDTO(updatedEvent);
    }

    // Delete event
    @Transactional
    public void deleteEvent(Long id) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Find event
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Check if user owns the event or is an admin
        if (!event.getCreatedBy().getId().equals(currentUser.getId()) &&
                !securityUtils.isSuperAdmin()) {
            throw new AccessDeniedException("You do not have permission to delete this event");
        }

        // Delete specialized event record first
        switch (event.getEventType()) {
            case PUBLIC:
                publicEventRepository.deleteById(id);
                break;
            case PRIVATE:
                privateEventRepository.deleteById(id);
                break;
            case RSO:
                rsoEventRepository.deleteById(id);
                break;
        }

        // Delete comments and ratings related to this event
        commentRepository.findByEventIdOrderByTimestampDesc(id)
                .forEach(comment -> commentRepository.delete(comment));

        // Delete the event
        eventRepository.delete(event);
    }

    // Get event by ID (with access check)
    public EventResponse getEventById(Long id) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Find event
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Check if user has access to this event
        if (!userHasAccessToEvent(event, currentUser)) {
            throw new AccessDeniedException("You do not have permission to view this event");
        }

        // Convert to DTO and return
        return convertToDTO(event);
    }

    // Get all events accessible by current user
    public List<EventResponse> getEventsForCurrentUser() {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Get all events
        List<Event> allEvents = eventRepository.findAll();

        // Filter events based on user access
        List<Event> accessibleEvents = allEvents.stream()
                .filter(event -> userHasAccessToEvent(event, currentUser))
                .collect(Collectors.toList());

        // Convert to DTOs and return
        return accessibleEvents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get events by type
    public List<EventResponse> getEventsByType(EventType eventType) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Get events by type
        List<Event> events = eventRepository.findByEventType(eventType);

        // Filter events based on user access
        List<Event> accessibleEvents = events.stream()
                .filter(event -> userHasAccessToEvent(event, currentUser))
                .toList();

        // Convert to DTOs and return
        return accessibleEvents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get events by college
    public List<EventResponse> getEventsByCollege(Long collegeId) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Get events by college
        List<Event> events = eventRepository.findByCollegeId(collegeId);

        // Filter events based on user access
        List<Event> accessibleEvents = events.stream()
                .filter(event -> userHasAccessToEvent(event, currentUser))
                .toList();

        // Convert to DTOs and return
        return accessibleEvents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Check if user has access to event
    private boolean userHasAccessToEvent(Event event, User user) {
        // Super admins can access all events
        if (securityUtils.isSuperAdmin()) {
            return true;
        }

        // Public events are accessible to all users
        if (event.getEventType() == EventType.PUBLIC) {
            PublicEvent publicEvent = publicEventRepository.findById(event.getId()).orElse(null);
            // Public events must be approved to be visible
            return publicEvent != null && publicEvent.getApproved();
        }

        // Private events are accessible to users from the same college
        if (event.getEventType() == EventType.PRIVATE) {
            return user.getCollege() != null &&
                    user.getCollege().getId().equals(event.getCollege().getId());
        }

        // RSO events are accessible to members of the RSO
        if (event.getEventType() == EventType.RSO) {
            RsoEvent rsoEvent = rsoEventRepository.findById(event.getId()).orElse(null);
            if (rsoEvent != null) {
                // Check if user is a member of the RSO
                return rsoMembershipRepository.existsByUserIdAndRsoId(
                        user.getId(), rsoEvent.getRso().getId());
            }
        }

        // If none of the above, user does not have access
        return false;
    }

    // Helper methods for creating specialized events
    private void createPublicEvent(Event event, EventCreateRequest request, User currentUser) {
        PublicEvent publicEvent = new PublicEvent();
        publicEvent.setEvent(event);
        publicEvent.setId(event.getId());
        publicEvent.setApproved(false); // start as unapproved

        // Check if currentUser is SUPER_ADMIN, auto-approve
        if (securityUtils.isSuperAdmin()) {
            publicEvent.setApproved(true);
            publicEvent.setSuperAdmin(currentUser);
        }

        publicEventRepository.save(publicEvent);
    }

    private void createPrivateEvent(Event event, EventCreateRequest request, User currentUser) {
        PrivateEvent privateEvent = new PrivateEvent();
        privateEvent.setEvent(event);
        privateEvent.setId(event.getId());
        privateEvent.setAdmin(currentUser);

        privateEventRepository.save(privateEvent);
    }

    private void createRsoEvent(Event event, EventCreateRequest request, User currentUser) {
        Rso rso = rsoRepository.findById(request.getRsoId())
                .orElseThrow(() -> new EntityNotFoundException("RSO not found"));

        RsoEvent rsoEvent = new RsoEvent();
        rsoEvent.setId(event.getId());
        rsoEvent.setEvent(event);
        rsoEvent.setRso(rso);

        rsoEventRepository.save(rsoEvent);
    }

    // Get events by date range
    public List<EventResponse> getEventsByDateRange(LocalDate startDate, LocalDate endDate) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Get events by date range
        List<Event> events = eventRepository.findByDateBetween(startDate, endDate);

        // Filter events based on user access
        List<Event> accessibleEvents = events.stream()
                .filter(event -> userHasAccessToEvent(event, currentUser))
                .toList();

        // Convert to DTOs and return
        return accessibleEvents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get events by RSO
    public List<EventResponse> getEventsByRso(Long rsoId) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Check if user is a member of the RSO
        if (!rsoMembershipRepository.existsByUserIdAndRsoId(currentUser.getId(), rsoId)) {
            throw new AccessDeniedException("You are not a member of this RSO");
        }

        // Find RSO events
        List<RsoEvent> rsoEvents = rsoEventRepository.findByRsoId(rsoId);

        // Extract event IDs
        List<Long> eventIds = rsoEvents.stream()
                .map(RsoEvent::getId)
                .collect(Collectors.toList());

        // Get events
        List<Event> events = eventRepository.findAllById(eventIds);

        // Convert to DTOs and return
        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}