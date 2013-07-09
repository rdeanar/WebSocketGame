<?
$ip = array();
exec("netstat -nr | grep 'UHS'",$ip);
$ip = trim(explode(' ',$ip[0])[0]);


$config = array(
    'ws' => 'http://'.$ip.':8000',
    'ip' => $ip,
);