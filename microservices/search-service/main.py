import pandas as pd

movies = pd.read_csv('dataset.csv')

movies = movies[['title']]

movie_titles = [
    "The Godfather",
    "The Dark Knight",
    "Pulp Fiction",
    "The Lord of the Rings",
    "Forrest Gump",
    "Inception",
    "Fight Club",
    "The Matrix",
    "Goodfellas",
    "The Silence of the Lambs"
]

df = movies

from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(df['title'])

from sklearn.metrics.pairwise import cosine_similarity

cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix);

def recommend_keywords(user_input, df, cosine_sim):
    user_inputJ_vectorized = vectorizer.transform([user_input])
    similarity_scores = cosine_similarity(user_inputJ_vectorized, tfidf_matrix)
    sorted_indices = similarity_scores.argsort()[0][::-1]
    top_indices = sorted_indices[:5]
    
    recommendations = df.iloc[top_indices]['title'].values
    return recommendations

user_input = "The"
recommendations = recommend_keywords(user_input, df, cosine_sim)

print("Recommended Keywords:")
for recommendation in recommendations:
    print(recommendation)
    
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/recommend', methods=['GET'])
def recommend():
    user_input = request.args.get('query')
    recommendations = recommend_keywords(user_input, df, cosine_sim)
    return jsonify(recommendations.tolist())

if __name__ == '__main__':
    app.run(debug=True)
