function parseOperations(response)
{
    switch(response.operation)
    {
        case 'obtainRoomID':
            obtainedRoomID(response);
            break;
    }
}
