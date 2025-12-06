<?php

namespace App\Tests\Businessrules\Remover;

use App\Businessrules\Remover\WebhookSubscriptionRemover;
use App\Serverside\Entity\WebhookSubscription;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class WebhookSubscriptionRemoverTest extends TestCase
{
    private EntityManagerInterface $entityManager;
    private WebhookSubscriptionRemover $webhookSubscriptionRemover;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->webhookSubscriptionRemover = new WebhookSubscriptionRemover($this->entityManager);
    }

    public function testCanInstantiateWebhookSubscriptionRemover(): void
    {
        $this->assertInstanceOf(WebhookSubscriptionRemover::class, $this->webhookSubscriptionRemover);
    }

    public function testRemoveCallsEntityManagerRemoveAndFlush(): void
    {
        $webhookSubscription = $this->createMock(WebhookSubscription::class);

        $this->entityManager
            ->expects($this->once())
            ->method('remove')
            ->with($this->identicalTo($webhookSubscription));

        $this->entityManager
            ->expects($this->once())
            ->method('flush');

        $this->webhookSubscriptionRemover->remove($webhookSubscription);
    }

    public function testRemoveCallsMethodsInCorrectOrder(): void
    {
        $webhookSubscription = $this->createMock(WebhookSubscription::class);
        $callOrder = [];

        $this->entityManager
            ->expects($this->once())
            ->method('remove')
            ->with($this->identicalTo($webhookSubscription))
            ->willReturnCallback(function () use (&$callOrder) {
                $callOrder[] = 'remove';
            });

        $this->entityManager
            ->expects($this->once())
            ->method('flush')
            ->willReturnCallback(function () use (&$callOrder) {
                $callOrder[] = 'flush';
            });

        $this->webhookSubscriptionRemover->remove($webhookSubscription);

        $this->assertSame(['remove', 'flush'], $callOrder);
    }

    public function testRemoveReturnsVoid(): void
    {
        $webhookSubscription = $this->createMock(WebhookSubscription::class);

        $this->entityManager
            ->method('remove');

        $this->entityManager
            ->method('flush');

        $result = $this->webhookSubscriptionRemover->remove($webhookSubscription);

        $this->assertNull($result);
    }
}
