<?php

namespace App\Businessrules\Persister;

use App\Serverside\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserPersister
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    public function save(User $user, ?string $currentPassword): void
    {
        if (empty($user->getPassword())) {
            $user->setPassword($currentPassword);
        } else {
            $user->setPassword($this->passwordHasher->hashPassword($user, $user->getPassword()));
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }
}
