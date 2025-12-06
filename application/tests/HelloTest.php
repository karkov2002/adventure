<?php

namespace App\Tests;

use PHPUnit\Framework\TestCase;

class HelloTest extends TestCase
{
    public function testThanOneEqualOne()
    {
        $this->assertEquals(1, 1);
    }
}
