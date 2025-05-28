package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.entity.*;
import com.example.backend.repository.CityRepository;
import com.example.backend.repository.CountryRepository;
import com.example.backend.repository.CustomerRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private CityRepository cityRepository;
    @Autowired
    private CountryRepository countryRepository;

    public CustomerDTO getCustomerByNic(String nic) {
        Customer customer = customerRepository.findByNic(nic)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        return toCustomerDTO(customer);
    }

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream().map(this::toCustomerDTO).collect(Collectors.toList());
    }


    public CustomerDTO createCustomer(CustomerRequestDTO customerDto) {
        if (customerRepository.existsByNic(customerDto.getNicNumber())) {
            throw new IllegalArgumentException("Customer with NIC already exists.");
        }

        Customer customer = new Customer();
        customer.setName(customerDto.getName());
        customer.setDob(customerDto.getDateOfBirth());
        customer.setNic(customerDto.getNicNumber());

        List<MobileNumber> numbers = new ArrayList<>();
        for (String number : customerDto.getMobileNumbers())
        {
            MobileNumber mNumber = new MobileNumber();
            mNumber.setNumber(number);
            mNumber.setCustomer(customer);
            numbers.add(mNumber);
        }
        customer.setMobileNumbers(numbers);

        List<Address> addresses = new ArrayList<>();
        for (AddressDTO addrReq : customerDto.getAddresses()) {
            Address address = new Address();
            address.setAddressLine1(addrReq.getAddressLine1());
            address.setAddressLine2(addrReq.getAddressLine2());
            address.setCity(addrReq.getCity());
            address.setCountry(addrReq.getCountry());

            address.setCustomer(customer);
            addresses.add(address);
        }
        customer.setAddresses(addresses);

        // Link to family members
        List<Customer> familyMembers = customerRepository.findAllByNicIn(customerDto.getFamilyMemberNics());
        customer.getFamilyMembers().addAll(familyMembers);

        Customer saved = customerRepository.save(customer);
        System.out.println("SAVED");
        return toCustomerDTO(saved);
    }

    public CustomerDTO updateCustomerByNic(String nic, @Valid CustomerRequestDTO requestDTO) {
        Customer customer = customerRepository.findByNic(nic)
                .orElseThrow(() -> new IllegalArgumentException("Customer with NIC " + nic + " not found"));

        customer.setName(requestDTO.getName());
        customer.setDob(requestDTO.getDateOfBirth());

        if (!customer.getNic().equals(requestDTO.getNicNumber()) && customerRepository.existsByNic(requestDTO.getNicNumber())) {
            throw new IllegalArgumentException("Customer with NIC already exists.");
        }

        customer.setNic(requestDTO.getNicNumber());

        customer.getMobileNumbers().clear();
        for (String number : requestDTO.getMobileNumbers())
        {
            MobileNumber mNumber = new MobileNumber();
            mNumber.setNumber(number);
            mNumber.setCustomer(customer);
            customer.getMobileNumbers().add(mNumber);

        }

        customer.getAddresses().clear();
        for (AddressDTO addrReq : requestDTO.getAddresses()) {
            Address address = new Address();
            address.setAddressLine1(addrReq.getAddressLine1());
            address.setAddressLine2(addrReq.getAddressLine2());
            address.setCity(addrReq.getCity());
            address.setCountry(addrReq.getCountry());

            address.setCustomer(customer);
            customer.getAddresses().add(address);
        }

        Customer saved = customerRepository.save(customer);
        return toCustomerDTO(saved);
    }

    public void fileProcess(MultipartFile file) {
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();
            List<Customer> customers = new ArrayList<>();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                String nic = formatter.formatCellValue(row.getCell(1));
                Customer customer = new Customer();


                if (customerRepository.existsByNic(nic)){
                    customer = customerRepository.findByNic(nic)
                            .orElseThrow(() -> new IllegalArgumentException("Customer with NIC " + nic + " not found"));
                }

                customer.setName(formatter.formatCellValue(row.getCell(0)));
                customer.setNic(formatter.formatCellValue(row.getCell(1)));

                String dobStr = formatter.formatCellValue(row.getCell(2));

                LocalDate dob = LocalDate.parse(dobStr);

                customer.setDob(dob);

                customers.add(customer);
            }

            int batchSize = 1000;
            for (int i = 0; i < customers.size(); i += batchSize) {
                int end = Math.min(i + batchSize, customers.size());
                customerRepository.saveAll(customers.subList(i, end));
                customerRepository.flush();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public CustomerDTO toCustomerDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setDateOfBirth(customer.getDob());
        dto.setNicNumber(customer.getNic());

        List<String> numbers = customer.getMobileNumbers().stream().map(MobileNumber::getNumber).toList();

        dto.setMobileNumbers(numbers);


        // Convert addresses
        List<AddressDTO> addressDTOs = customer.getAddresses().stream().map(addr -> {
            AddressDTO a = new AddressDTO();

            a.setAddressLine1(addr.getAddressLine1());
            a.setAddressLine2(addr.getAddressLine2());

            a.setCity(addr.getCity());


            a.setCountry(addr.getCountry());
            return a;
        }).toList();
        dto.setAddresses(addressDTOs);

        List<FamilyMemberDTO> familyDTOs = customer.getFamilyMembers().stream().map(fam -> {
            FamilyMemberDTO fm = new FamilyMemberDTO();
            fm.setId(fam.getId());
            fm.setName(fam.getName());
            fm.setNicNumber(fam.getNic());
            return fm;
        }).toList();
        dto.setFamilyMemberNics(familyDTOs);

        return dto;
    }



}
