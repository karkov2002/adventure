<?php

namespace App\Businessrules\Provider;

use App\Serverside\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserProvider
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function getUsers(): array
    {
        return $this->entityManager->getRepository(User::class)->findAll();
    }

    public function getUser(int $id)
    {
        return $this->entityManager->getRepository(User::class)->find($id);
    }
}
