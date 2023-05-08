function parseOperations(response)
{
    switch(response.operation)
    {
        case 'obtainRoomID':
            joinedToGame(response);
            break;

        case 'joinedToGame':
            joinedToGame(response);
            break;

        case 'playerJoined':
            playerJoined(response);
            break;

        case 'startGame':
            break;
    }
}
