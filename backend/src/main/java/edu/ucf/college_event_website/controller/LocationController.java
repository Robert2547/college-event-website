package edu.ucf.college_event_website.controller;

import edu.ucf.college_event_website.model.Location;
import edu.ucf.college_event_website.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private LocationRepository locationRepository;

    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody Location location) {
        Location saved = locationRepository.save(location);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}

