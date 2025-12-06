<?php

namespace App\Serverside\Utils;

class DateTimer
{
    /** DateTime Pattern */
    public const DATETIME_PATTERN = 'Y-m-d\TH:i:s\.uO';
    public const MYSQL_DATETIME_PATTERN = 'Y-m-d H:i:s';
    public const DATETIME_WITH_GMT_PATTERN = 'Y-m-d\TH:i:s+'; // 'Y-m-d\TH:i:sP'
    public const ZULU_FORMAT = \DateTime::ATOM;
    public const DATETIME_PATTERN_FOR_FILENAME = 'YmdHis';

    /** Date Pattern */
    public const DATE_PATTERN = 'Y-m-d';

    public function getDateTime(string $date = 'now')
    {
        return new \DateTime($date);
    }
}
