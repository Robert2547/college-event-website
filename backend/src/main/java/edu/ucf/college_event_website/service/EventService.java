package edu.ucf.college_event_website.service;

import edu.ucf.college_event_website.dto.EventCreateRequest;
import edu.ucf.college_event_website.dto.EventResponse;
import edu.ucf.college_event_website.model.*;
import edu.ucf.college_event_website.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private UserRepository userRepository;

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
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get college
        College college = collegeRepository.findById(request.getCollegeId())
                .orElseThrow(() -> new RuntimeException("College not found"));

        // Get location
        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

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

    // Update an event
    @Transactional
    public EventResponse updateEvent(Long id, EventCreateRequest request) throws AccessDeniedException {
        // Get authenticated user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get event
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Check if user has rights to update
        if (!canUpdateEvent(currentUser, event)) {
            throw new AccessDeniedException("You do not have permission to update this event");
        }

        // Get location if it's changed
        if (request.getLocationId() != null) {
            Location location = locationRepository.findById(request.getLocationId())
                    .orElseThrow(() -> new EntityNotFoundException("Location not found"));
            event.setLocation(location);
        }

        // Update basic event properties
        if (request.getName() != null) event.setName(request.getName());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getTime() != null) event.setTime(request.getTime());
        if (request.getDate() != null) event.setDate(request.getDate());
        if (request.getContactPhone() != null) event.setContactPhone(request.getContactPhone());
        if (request.getContactEmail() != null) event.setContactEmail(request.getContactEmail());

        // Save updated event
        Event updatedEvent = eventRepository.save(event);

        return convertToDTO(updatedEvent);

    }

    private boolean canUpdateEvent(User user, Event event) {
        // Event creator can update
        if (event.getCreatedBy().getId().equals(user.getId())) {
            return true;
        }

        // Super admins can update any event
        if (user.getRole() == Role.SUPER_ADMIN) {
            return true;
        }

        // RSO admin can update their RSO events
        if (event.getEventType() == EventType.RSO) {
            RsoEvent rsoEvent = rsoEventRepository.findById(event.getId()).orElse(null);
            return rsoEvent != null && rsoEvent.getRso().getAdmin().getId().equals(user.getId());
        }

        return false;
    }

    // Same logic as update
    private boolean canDeleteEvent(User user, Event event) {
        return canUpdateEvent(user, event);
    }

    // Create a new public event
    private void createPublicEvent(Event event, EventCreateRequest request, User currentUser) {
        PublicEvent publicEvent = new PublicEvent();
        publicEvent.setEvent(event);
        publicEvent.setId(event.getId());
        publicEvent.setApproved(false); // start as unapproved

        // Check if currentUser is SUPER_ADMIN, auto-approve
        if (currentUser.getRole() == Role.SUPER_ADMIN) {
            publicEvent.setApproved(true);
            publicEvent.setSuperAdmin(currentUser);
        }

        publicEventRepository.save(publicEvent);


    }

    // Create a new private event
    private void createPrivateEvent(Event event, EventCreateRequest request, User currentUser) {
        PrivateEvent privateEvent = new PrivateEvent();
        privateEvent.setEvent(event);
        privateEvent.setId(event.getId());
        privateEvent.setAdmin(currentUser);

        privateEventRepository.save(privateEvent);
    }

    // Create a new RSO event
    private void createRsoEvent(Event event, EventCreateRequest request, User currentUser) {
        Rso rso = rsoRepository.findById(request.getRsoId())
                .orElseThrow(() -> new EntityNotFoundException("RSO not found"));

        RsoEvent rsoEvent = new RsoEvent();
        rsoEvent.setId(event.getId());
        rsoEvent.setEvent(event);
        rsoEvent.setRso(rso);

        rsoEventRepository.save(rsoEvent);
    }

    // Get all events accessible to the current user
    private List<EventResponse> getAccessibleEvents() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Event> events;

        // If SUPER_ADMIN, get all events
        if (currentUser.getRole().equals(Role.SUPER_ADMIN)) {
            events = eventRepository.findAll();
        } else {
            events = eventRepository.findAccessibleEvents(currentUser.getId(), currentUser.getCollege().getId());
        }

        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
