import pymongo
import pandas as pd
from bson import ObjectId
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI
from typing import List
import os

uri = "mongodb+srv://maria:maria22@brainit.iuj2zxy.mongodb.net/?retryWrites=true&w=majority&appName=BrainIT"
client = pymongo.MongoClient(uri, tls=True, tlsAllowInvalidCertificates=True)
db = client["BrainIT"]

conti_collection = db["conti"]
courses_collection = db["cursuri"]

app = FastAPI()

def recomanda_top_cursuri(user_id: str, top_n: int = 3) -> List[str]:
    user = conti_collection.find_one({"_id": ObjectId(user_id)}, {"cursuri": 1})
    if not user or "cursuri" not in user or not user["cursuri"]:
        return []

    cursuri_asignate_ids = [ObjectId(c) for c in user["cursuri"]]

    cursuri_asignate = list(courses_collection.find(
        {"_id": {"$in": cursuri_asignate_ids}}, {"descriere": 1}
    ))
    if not cursuri_asignate:
        return []

    descrieri_asignate = " ".join([c.get("descriere", "") for c in cursuri_asignate])

    toate_cursurile = list(courses_collection.find({}, {"_id": 1, "descriere": 1, "nume": 1}))
    if not toate_cursurile:
        return []

    df_cursuri = pd.DataFrame(toate_cursurile)
    df_cursuri["descriere"] = df_cursuri["descriere"].fillna("")

    vectorizer = TfidfVectorizer(max_features=1000)
    vectorizer.fit(df_cursuri["descriere"])

    cursuri_matrix = vectorizer.transform(df_cursuri["descriere"])
    descriere_vector = vectorizer.transform([descrieri_asignate])

    cosine_sim = cosine_similarity(descriere_vector, cursuri_matrix).flatten()

    df_cursuri["similaritate"] = cosine_sim
    df_cursuri = df_cursuri[~df_cursuri["_id"].isin(cursuri_asignate_ids)]

    top_recomandari = df_cursuri.sort_values("similaritate", ascending=False).head(top_n)

    return [str(cid) for cid in top_recomandari["_id"]]

@app.get("/recommend", response_model=List[str])
def recommend(user_id: str):
    return recomanda_top_cursuri(user_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("AI:app", host="localhost", port=3001, reload=True)
