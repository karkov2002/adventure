<?php

namespace App\Tests\Businessrules\Remover;

use App\Businessrules\Remover\UserRemover;
use App\Serverside\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class UserRemoverTest extends TestCase
{
    private EntityManagerInterface $entityManager;
    private UserRemover $userRemover;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->userRemover = new UserRemover($this->entityManager);
    }

    public function testCanInstantiateUserRemover(): void
    {
        $this->assertInstanceOf(UserRemover::class, $this->userRemover);
    }

    public function testRemoveCallsEntityManagerRemoveAndFlush(): void
    {
        $user = $this->createMock(User::class);

        $this->entityManager
            ->expects($this->once())
            ->method('remove')
            ->with($this->identicalTo($user));

        $this->entityManager
            ->expects($this->once())
            ->method('flush');

        $this->userRemover->remove($user);
    }

    public function testRemoveCallsMethodsInCorrectOrder(): void
    {
        $user = $this->createMock(User::class);
        $callOrder = [];

        $this->entityManager
            ->expects($this->once())
            ->method('remove')
            ->with($this->identicalTo($user))
            ->willReturnCallback(function () use (&$callOrder) {
                $callOrder[] = 'remove';
            });

        $this->entityManager
            ->expects($this->once())
            ->method('flush')
            ->willReturnCallback(function () use (&$callOrder) {
                $callOrder[] = 'flush';
            });

        $this->userRemover->remove($user);

        $this->assertSame(['remove', 'flush'], $callOrder);
    }
}
