<?php

namespace App\Clientside\Controller;

use App\Businessrules\Persister\UserPersister;
use App\Businessrules\Provider\UserProvider;
use App\Businessrules\Remover\UserRemover;
use App\Clientside\Form\EditUserType;
use App\Serverside\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class UserController extends AbstractController
{
    private UserProvider $userProvider;
    private UserPersister $userPersister;
    private UserRemover $userRemover;
    private UrlGeneratorInterface $urlGenerator;

    public function __construct(
        UserProvider $userProvider,
        UserPersister $userPersister,
        UserRemover $userRemover,
        UrlGeneratorInterface $urlGenerator)
    {
        $this->userProvider = $userProvider;
        $this->userPersister = $userPersister;
        $this->urlGenerator = $urlGenerator;
        $this->userRemover = $userRemover;
    }

    #[Route(path: '/user', name: 'user')]
    public function listUser(Request $request): Response
    {
        $users = $this->userProvider->getUsers();

        return $this->render('user/user.html.twig', [
            'users' => $users,
        ]);
    }

    #[Route(path: '/edit-user/{id}', name: 'edit-user', defaults: ['id' => null])]
    public function editUser(Request $request, ?User $user): Response
    {
        if (null === $user) {
            $user = new User();
        }

        $currentPassword = $user->getPassword();
        $editUserForm = $this->createForm(EditUserType::class, $user);

        $editUserForm->handleRequest($request);

        if ($editUserForm->isSubmitted() && $editUserForm->isValid()) {
            $user = $editUserForm->getData();
            $this->userPersister->save($user, $currentPassword);
            $url = $this->urlGenerator->generate('edit-user', ['id' => $user->getId()]);

            return new RedirectResponse($url);
        }

        return $this->render('user/edit-user.html.twig', [
            'user'           => $user,
            'edit_user_form' => $editUserForm->createView(),
        ]);
    }

    #[Route(path: '/delete-user/{id}', name: 'delete-user')]
    public function deleteUser(Request $request, User $user): Response
    {
        $this->userRemover->remove($user);
        $url = $this->urlGenerator->generate('user');

        return new RedirectResponse($url);
    }
}
