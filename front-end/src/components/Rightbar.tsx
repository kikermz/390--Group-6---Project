"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from './RightBar.module.css';

interface User {
  username: string;
  profile_picture: string;
}

interface Article {
  title: string;
  url: string;
  urlToImage?: string;
  description?: string;
}

const RightBar = () => {
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
  
    useEffect(() => {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  
      fetch(`http://localhost:5000/randomUsers?userID=${currentUser.userID}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setSuggestedUsers(data.users);
        });

  const apiKey= process.env.NEXT_PUBLIC_NEWS_API_KEY;
  if (apiKey) {
    fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("NewsAPI Response:", data);
        setArticles(data.articles?.slice(0, 6) || []);
      })
      .catch((error) => console.error("Error fetching news:", error));
  } else {
    console.error("API key is missing!");
  }
}, []);
  
    return (
        <div className={styles.rightbar}> 
          {/* Suggested Users */}
          <div className={styles.section}>
            <h1 className={styles.sectionTitle}>Suggested Users</h1>
            <ul className={styles.userList}>
              {suggestedUsers.length > 0 ? (
                suggestedUsers.map((user, index) => (
                  <li key={index} className={styles.userItem}>
                    <div className={styles.userInfo}>
                      <Image
                        src={user.profile_picture || "/icons/user.png"}
                        alt={user.username}
                        width={50}
                        height={50}
                        className={styles.userImage}
                      />
                      <span className={styles.username}>{user.username}</span>
                    </div>
                  </li>
                ))
              ) : (
                <p>No users to suggest</p>
              )}
            </ul>
          </div>
    
          {/* News Articles */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitleL}>Live News</h2>
            <ul className={styles.newsList}>
              {articles.length > 0 ? (
                articles.map((article, index) => (
                  <li key={index} className={styles.newsItem}>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <div className={styles.newsHeader}>
                        <h3 className={styles.newsTitle}>{article.title}</h3>
                        {article.urlToImage && (
                          <Image
                            src={article.urlToImage}
                            alt={article.title}
                            width={100}
                            height={100}
                            className={styles.newsImage}
                          />
                        )}
                      </div>
                      <p className={styles.newsDescription}>{article.description}</p>
                    </a>
                  </li>
                ))
              ) : (
                <p>No articles available</p>
              )}
            </ul>
          </div>
        </div>
      );
    };
    
    export default RightBar;