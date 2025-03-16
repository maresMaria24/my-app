import pymongo
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

uri = "mongodb+srv://maresmaria21:vsNcu9JifDcA6sl1@brainit.iuj2zxy.mongodb.net/?retryWrites=true&w=majority&appName=BrainIT"
client = pymongo.MongoClient(uri, tls=True, tlsAllowInvalidCertificates=True)
db = client["BrainIT"]

searches_collection = db["cautari"]
courses_collection = db["cursuri"]

def recomanda_cursuri_pentru_user(user_id, top_n=5):
    searches = list(searches_collection.find({"user": user_id}))
    df_searches = pd.DataFrame(searches)

    if df_searches.empty:
        return ["Nu există căutări pentru acest utilizator."]

    df_searches["query"] = df_searches["query"].fillna("")
    df_searches["matched_courses"] = df_searches["matched_courses"].apply(lambda x: x if isinstance(x, list) else [])

    courses = list(courses_collection.find({}, {"_id": 1, "nume": 1, "descriere": 1}))
    df_courses = pd.DataFrame(courses)
    
    if df_courses.empty:
        return ["Nu există cursuri în baza de date."]

    df_courses["descriere"] = df_courses["descriere"].fillna("")

    vectorizer = TfidfVectorizer()
    
    combined_texts = list(df_searches["query"]) + list(df_courses["descriere"])
    
    tfidf_matrix = vectorizer.fit_transform(combined_texts)

    search_vectors = tfidf_matrix[: len(df_searches)]
    course_vectors = tfidf_matrix[len(df_searches):]

    similarity_matrix = cosine_similarity(search_vectors, course_vectors)

    recommended_courses = set()

    for i, search in enumerate(df_searches["query"]):
        top_indices = similarity_matrix[i].argsort()[::-1][:top_n]
        
        for idx in top_indices:
            if similarity_matrix[i][idx] > 0.1:
                recommended_courses.add(df_courses.iloc[idx]["_id"])

    for courses in df_searches["matched_courses"]:
        recommended_courses.update(courses)

    return list(recommended_courses) if recommended_courses else ["Nu s-au găsit cursuri relevante."]

user_id = "6659b89a262fde1750874e1c"  
recommendations = recomanda_cursuri_pentru_user(user_id)
print(f"Cursuri recomandate pentru utilizatorul {user_id}: {recommendations}")
