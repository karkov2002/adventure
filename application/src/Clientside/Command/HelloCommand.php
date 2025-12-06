<?php

namespace App\Clientside\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'mdgc:hello',
    description: 'An hello world command',
    hidden: false
)]
class HelloCommand extends Command
{
    public function configure(): void
    {
        $this
            ->addOption('shop', 's', InputOption::VALUE_OPTIONAL, 'Shop url to import to', null)
        ;
    }

    public function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Hello World Command');

        return Command::SUCCESS;
    }
}
