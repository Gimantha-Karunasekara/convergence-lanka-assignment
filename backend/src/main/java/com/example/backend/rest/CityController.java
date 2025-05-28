package com.example.backend.rest;


import com.example.backend.dto.CityDTO;
import com.example.backend.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/city")
public class CityController {

    @Autowired
    private CityService cityService;

    @GetMapping
    public ResponseEntity<List<CityDTO>> getAllCities (){
        List<CityDTO> cities =  cityService.getAllCities();
        return ResponseEntity.ok(cities);
    }

    @GetMapping("/{countryID}")
    public ResponseEntity<List<CityDTO>> getCitiesByCountry(@PathVariable Long countryID)
    {
        List<CityDTO> cities =  cityService.getCitiesByCountry(countryID);
        return ResponseEntity.ok(cities);
    }
}
