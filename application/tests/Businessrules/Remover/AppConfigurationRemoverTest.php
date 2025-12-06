<?php

namespace App\Tests\Businessrules\Remover;

use App\Businessrules\Remover\AppConfigurationRemover;
use App\Serverside\Entity\AppConfig;
use App\Serverside\Entity\Shop;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class AppConfigurationRemoverTest extends TestCase
{
    private EntityManagerInterface $entityManager;
    private AppConfigurationRemover $appConfigurationRemover;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->appConfigurationRemover = new AppConfigurationRemover($this->entityManager);
    }

    public function testCanInstantiateAppConfigurationRemover(): void
    {
        $this->assertInstanceOf(AppConfigurationRemover::class, $this->appConfigurationRemover);
    }

    public function testRemoveOneAppConfigurationWithNoShops(): void
    {
        $appConfig = $this->createMock(AppConfig::class);
        $appConfig->method('getShops')->willReturn(new ArrayCollection([]));

        $this->entityManager
            ->expects($this->once())
            ->method('remove')
            ->with($this->identicalTo($appConfig));

        $this->entityManager
            ->expects($this->once())
            ->method('flush');

        $this->appConfigurationRemover->removeOneAppConfiguration($appConfig);
    }

    public function testRemoveOneAppConfigurationWithOneShop(): void
    {
        $shop = $this->createMock(Shop::class);
        $appConfig = $this->createMock(AppConfig::class);
        $appConfig->method('getShops')->willReturn(new ArrayCollection([$shop]));

        $this->entityManager
            ->expects($this->exactly(2))
            ->method('remove')
            ->willReturnCallback(function ($entity) use ($shop, $appConfig) {
                static $callCount = 0;
                ++$callCount;

                if (1 === $callCount) {
                    $this->assertSame($shop, $entity);
                } elseif (2 === $callCount) {
                    $this->assertSame($appConfig, $entity);
                }
            });

        $this->entityManager
            ->expects($this->once())
            ->method('flush');

        $this->appConfigurationRemover->removeOneAppConfiguration($appConfig);
    }

    public function testRemoveOneAppConfigurationWithMultipleShops(): void
    {
        $shop1 = $this->createMock(Shop::class);
        $shop2 = $this->createMock(Shop::class);
        $shop3 = $this->createMock(Shop::class);

        $appConfig = $this->createMock(AppConfig::class);
        $appConfig->method('getShops')->willReturn(new ArrayCollection([$shop1, $shop2, $shop3]));

        $removedEntities = [];
        $this->entityManager
            ->expects($this->exactly(4))
            ->method('remove')
            ->willReturnCallback(function ($entity) use (&$removedEntities) {
                $removedEntities[] = $entity;
            });

        $this->entityManager
            ->expects($this->once())
            ->method('flush');

        $this->appConfigurationRemover->removeOneAppConfiguration($appConfig);

        $this->assertCount(4, $removedEntities);
        $this->assertSame($shop1, $removedEntities[0]);
        $this->assertSame($shop2, $removedEntities[1]);
        $this->assertSame($shop3, $removedEntities[2]);
        $this->assertSame($appConfig, $removedEntities[3]);
    }

    public function testRemoveOneAppConfigurationCallsMethodsInCorrectOrder(): void
    {
        $shop = $this->createMock(Shop::class);
        $appConfig = $this->createMock(AppConfig::class);
        $appConfig->method('getShops')->willReturn(new ArrayCollection([$shop]));

        $callOrder = [];

        $this->entityManager
            ->method('remove')
            ->willReturnCallback(function ($entity) use (&$callOrder, $shop, $appConfig) {
                if ($entity === $shop) {
                    $callOrder[] = 'remove_shop';
                } elseif ($entity === $appConfig) {
                    $callOrder[] = 'remove_appconfig';
                }
            });

        $this->entityManager
            ->method('flush')
            ->willReturnCallback(function () use (&$callOrder) {
                $callOrder[] = 'flush';
            });

        $this->appConfigurationRemover->removeOneAppConfiguration($appConfig);

        $this->assertSame(['remove_shop', 'remove_appconfig', 'flush'], $callOrder);
    }
}
