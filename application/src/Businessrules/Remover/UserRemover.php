<?php

namespace App\Businessrules\Remover;

use App\Serverside\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserRemover
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function remove(User $user): void
    {
        $this->entityManager->remove($user);
        $this->entityManager->flush();
    }
}
