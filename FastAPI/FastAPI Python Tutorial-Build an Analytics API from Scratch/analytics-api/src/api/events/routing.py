from fastapi import APIRouter, Depends, HTTPException, Query

router = APIRouter()

@router.get("/")
def read_events(): 
    return {
        "items": [1, 2, 3]
    }



@router.get("/{event_id}")
def read_events(event_id:int): 
    return {
        "id": event_id
    }