<?php

namespace App\Tests\Businessrules\Model;

use App\Businessrules\Model\AddressModel;
use PHPUnit\Framework\TestCase;

class AddressModelTest extends TestCase
{
    private AddressModel $addressModel;

    protected function setUp(): void
    {
        $this->addressModel = new AddressModel();
    }

    public function testCanInstantiateAddressModel(): void
    {
        $this->assertInstanceOf(AddressModel::class, $this->addressModel);
    }

    public function testFirstNameProperty(): void
    {
        $this->addressModel->firstName = 'John';
        $this->assertSame('John', $this->addressModel->firstName);

        $this->addressModel->firstName = null;
        $this->assertNull($this->addressModel->firstName);
    }

    public function testAddress1Property(): void
    {
        $this->addressModel->address1 = '123 Main Street';
        $this->assertSame('123 Main Street', $this->addressModel->address1);

        $this->addressModel->address1 = null;
        $this->assertNull($this->addressModel->address1);
    }

    public function testPhoneProperty(): void
    {
        $this->addressModel->phone = '+33612345678';
        $this->assertSame('+33612345678', $this->addressModel->phone);

        $this->addressModel->phone = null;
        $this->assertNull($this->addressModel->phone);
    }

    public function testCityProperty(): void
    {
        $this->addressModel->city = 'Paris';
        $this->assertSame('Paris', $this->addressModel->city);

        $this->addressModel->city = null;
        $this->assertNull($this->addressModel->city);
    }

    public function testZipCodeProperty(): void
    {
        $this->addressModel->zipCode = '75001';
        $this->assertSame('75001', $this->addressModel->zipCode);

        $this->addressModel->zipCode = null;
        $this->assertNull($this->addressModel->zipCode);
    }

    public function testProvinceProperty(): void
    {
        $this->addressModel->province = 'Île-de-France';
        $this->assertSame('Île-de-France', $this->addressModel->province);

        $this->addressModel->province = null;
        $this->assertNull($this->addressModel->province);
    }

    public function testCountryProperty(): void
    {
        $this->addressModel->country = 'France';
        $this->assertSame('France', $this->addressModel->country);

        $this->addressModel->country = null;
        $this->assertNull($this->addressModel->country);
    }

    public function testLastNameProperty(): void
    {
        $this->addressModel->lastName = 'Doe';
        $this->assertSame('Doe', $this->addressModel->lastName);
    }

    public function testAddress2Property(): void
    {
        $this->addressModel->address2 = 'Apartment 4B';
        $this->assertSame('Apartment 4B', $this->addressModel->address2);

        $this->addressModel->address2 = null;
        $this->assertNull($this->addressModel->address2);
    }

    public function testCompanyProperty(): void
    {
        $this->addressModel->company = 'Acme Inc.';
        $this->assertSame('Acme Inc.', $this->addressModel->company);

        $this->addressModel->company = null;
        $this->assertNull($this->addressModel->company);
    }

    public function testLatitudeProperty(): void
    {
        $this->addressModel->latitude = '48.8566';
        $this->assertSame('48.8566', $this->addressModel->latitude);

        $this->addressModel->latitude = null;
        $this->assertNull($this->addressModel->latitude);
    }

    public function testLongitudeProperty(): void
    {
        $this->addressModel->longitude = '2.3522';
        $this->assertSame('2.3522', $this->addressModel->longitude);

        $this->addressModel->longitude = null;
        $this->assertNull($this->addressModel->longitude);
    }

    public function testNameProperty(): void
    {
        $this->addressModel->name = 'Home Address';
        $this->assertSame('Home Address', $this->addressModel->name);

        $this->addressModel->name = null;
        $this->assertNull($this->addressModel->name);
    }

    public function testCountryCodeProperty(): void
    {
        $this->addressModel->countryCode = 'FR';
        $this->assertSame('FR', $this->addressModel->countryCode);

        $this->addressModel->countryCode = null;
        $this->assertNull($this->addressModel->countryCode);
    }

    public function testProvinceCodeProperty(): void
    {
        $this->addressModel->provinceCode = 'IDF';
        $this->assertSame('IDF', $this->addressModel->provinceCode);

        $this->addressModel->provinceCode = null;
        $this->assertNull($this->addressModel->provinceCode);
    }

    public function testAllPropertiesCanBeSetSimultaneously(): void
    {
        $this->addressModel->firstName = 'John';
        $this->addressModel->lastName = 'Doe';
        $this->addressModel->address1 = '123 Main Street';
        $this->addressModel->address2 = 'Apt 4B';
        $this->addressModel->city = 'Paris';
        $this->addressModel->zipCode = '75001';
        $this->addressModel->province = 'Île-de-France';
        $this->addressModel->provinceCode = 'IDF';
        $this->addressModel->country = 'France';
        $this->addressModel->countryCode = 'FR';
        $this->addressModel->phone = '+33612345678';
        $this->addressModel->company = 'Acme Inc.';
        $this->addressModel->latitude = '48.8566';
        $this->addressModel->longitude = '2.3522';
        $this->addressModel->name = 'Home';

        $this->assertSame('John', $this->addressModel->firstName);
        $this->assertSame('Doe', $this->addressModel->lastName);
        $this->assertSame('123 Main Street', $this->addressModel->address1);
        $this->assertSame('Apt 4B', $this->addressModel->address2);
        $this->assertSame('Paris', $this->addressModel->city);
        $this->assertSame('75001', $this->addressModel->zipCode);
        $this->assertSame('Île-de-France', $this->addressModel->province);
        $this->assertSame('IDF', $this->addressModel->provinceCode);
        $this->assertSame('France', $this->addressModel->country);
        $this->assertSame('FR', $this->addressModel->countryCode);
        $this->assertSame('+33612345678', $this->addressModel->phone);
        $this->assertSame('Acme Inc.', $this->addressModel->company);
        $this->assertSame('48.8566', $this->addressModel->latitude);
        $this->assertSame('2.3522', $this->addressModel->longitude);
        $this->assertSame('Home', $this->addressModel->name);
    }
}
