<?php

namespace App\Clientside\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TreeController extends AbstractController
{
    #[Route(path: '/tree', name: 'tree')]
    public function index(Request $request): Response
    {
        return $this->render('tree/tree.html.twig');
    }
}
