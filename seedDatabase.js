'use strict';

const Company = require('../models/company');
const Location = require('../models/location');

const companyData = [
  {
    company_name: 'BP',
    email: 'bingbong@pp.com',
    username: 'gonkit',
    password: 'g4hj32gj',
    fleet: [
      {
        car_id: '12344234',
        car_model: 'Abrams Tank',
        license_number: '3g329423',
        MAC_address: 'a5:b7:cc:98:45',
        total_driving_time: 200,
        total_miles_driven: 400
      }
    ]
  },
  {
    company_name: 'Shell oil',
    email: 'boombamg@pp.com',
    username: 'bigby',
    password: '2g999999j',
    fleet: [
      {
        car_id: '12344234',
        car_model: 'hoop-D',
        license_number: '39423',
        MAC_address: 'a5:b7:bb:98:45',
        total_driving_time: 300,
        total_miles_driven: 78
      }
    ]
  },
  {
    company_name: 'Exxon',
    email: 'boombamg@pp.com',
    username: 'bigby',
    password: '2g999999j',
    fleet: [
      {
        car_id: '12344234',
        car_model: 'hoop-D',
        license_number: '39423',
        MAC_address: 'a5:b7:bb:98:45',
        total_driving_time: 300,
        total_miles_driven: 78
      }
    ]
  }
]


companyData.forEach( (comp) => {
  const newCompany = new Company ((comp)); // creates new document
  newCompany.save(); // inserts the document into collection. save is mongoose method for documents
});
