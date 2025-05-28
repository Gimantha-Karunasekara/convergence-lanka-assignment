package com.example.backend.rest;

import com.example.backend.dto.CustomerRequestDTO;
import com.example.backend.dto.CustomerDTO;
import com.example.backend.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadCustomers(@RequestParam("file") MultipartFile file) {
        try {
            customerService.fileProcess(file);
            return ResponseEntity.ok("File uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading file: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> createCustomer(@RequestBody  @Valid CustomerRequestDTO customer) {
        CustomerDTO customerDTO = customerService.createCustomer(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(customerDTO);
    }

    @PutMapping("/{nic}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable String nic,
                                                      @RequestBody @Valid CustomerRequestDTO requestDTO) {
        CustomerDTO updated = customerService.updateCustomerByNic(nic, requestDTO);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{nic}")
    public ResponseEntity<CustomerDTO> getCustomerByNic(@PathVariable String nic) {
        CustomerDTO customer = customerService.getCustomerByNic(nic);
        return ResponseEntity.ok(customer);
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<CustomerDTO> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }
}
