package com.example.backend.service;

import com.example.backend.dto.CityDTO;
import com.example.backend.entity.City;
import com.example.backend.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CityService {

    @Autowired
    private CityRepository cityRepository;

    public List<CityDTO> getAllCities(){
        return cityRepository.findAll().stream().map(this::toCityDto).collect(Collectors.toList());
    }

    public List<CityDTO> getCitiesByCountry(Long id)
    {
        return cityRepository.findAllByCountryId(id).stream().map(this::toCityDto).collect(Collectors.toList());
    }

    public CityDTO toCityDto(City city)
    {
        CityDTO dto = new CityDTO();
        dto.setName(city.getName());
        dto.setId(city.getId());
        dto.setCountryId(city.getCountry().getId());

        return dto;
    }

}
