package com.example.backend.service;

import com.example.backend.dto.CountryDTO;
import com.example.backend.entity.Country;
import com.example.backend.repository.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CountryService {

    @Autowired
    private CountryRepository countryRepository;

    public List<CountryDTO> getAllCountries(){
        return countryRepository.findAll().stream().map(this::toCountryDto).collect(Collectors.toList());
    }

    public CountryDTO toCountryDto(Country country)
    {
        CountryDTO dto = new CountryDTO();
        dto.setName(country.getName());
        dto.setId(country.getId());

        return dto;
    }
}
