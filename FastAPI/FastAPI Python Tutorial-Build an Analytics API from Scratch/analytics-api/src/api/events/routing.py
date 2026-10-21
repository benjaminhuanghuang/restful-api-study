from fastapi import APIRouter, Depends, HTTPException, Query

router = APIRouter()

@router.get("/")
def read_events(): 
    return {
        "items": [1, 2, 3]
    }