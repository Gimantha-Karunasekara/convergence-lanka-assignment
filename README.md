# convergence-lanka-assignment - Customer Management System

## Features

- View All Customers
- Create Customer
- View Customer
- Update Customer
- Bulk Creation/Updates

## Frontend start command

```
npm i
npm run dev
```

Port: 5173

## Backend Endpoints

- Get All Customers: GET /api/customer
- Get CustomerByNic: GET /api/customer/:nic
- Create Customer: POST /api/customer
- Update Customer: PUT /api/customer/:nic
- Bulk upload: POST /api/customer/upload
- Get All Cities: GET api/city
- Get All Countries: GET api/country

### Customer Creation/Update Sample JSON

```

{
  "name": "James White",
  "dateOfBirth": "1999-02-01",
  "nicNumber": "1999123912V",
  "mobileNumbers": ["0779128931", "07117289311"],
  "addresses": [
    {
      "addressLine1": "No 50",
      "addressLine2": "Pine Street",
      "city": "New York",
      "country": "USA"
    }
  ],
  "familyMemberNics": ["951112223V", "850987654V"]
}

```

- Backend Port: 8080
- DB Name: test_db

- Note: Data Source JDBC url is configured to port 3307 in this configuration (edit application.properties)
