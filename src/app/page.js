"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./globals.css";

export default function MemoryGame() {
  const maxTime = 20;
  const totalPairs = 6;

  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [flips, setFlips] = useState(0);
  const [matched, setMatched] = useState(0);
  const [cards, setCards] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [disableDeck, setDisableDeck] = useState(false);
  const [selected, setSelected] = useState([]);
  const timerRef = useRef(null);

  // shuffle cards on load
  useEffect(() => {
    shuffleCards();
  }, []);

  // timer countdown
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else {
      clearTimeout(timerRef.current);
    }
  }, [isPlaying, timeLeft]);

  function shuffleCards() {
    const arr = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]
      .sort(() => Math.random() - 0.5)
      .map((num, idx) => ({
        id: idx,
        img: `/images/img-${num}.png`,
        flipped: false,
        matched: false
      }));

    setCards(arr);
    setTimeLeft(maxTime);
    setFlips(0);
    setMatched(0);
    setIsPlaying(false);
    setDisableDeck(false);
    setSelected([]);
  }

  function flipCard(index) {
    if (!isPlaying) setIsPlaying(true);
    if (disableDeck || cards[index].flipped || timeLeft <= 0) return;

    const updatedCards = [...cards];
    updatedCards[index].flipped = true;
    setCards(updatedCards);
    setFlips(f => f + 1);

    if (selected.length === 0) {
      setSelected([index]);
    } else {
      setSelected([...selected, index]);
      setDisableDeck(true);

      const firstCard = updatedCards[selected[0]];
      const secondCard = updatedCards[index];

      if (firstCard.img === secondCard.img) {
        updatedCards[selected[0]].matched = true;
        updatedCards[index].matched = true;
        setCards(updatedCards);
        setMatched(m => m + 1);
        setSelected([]);
        setDisableDeck(false);
        if (matched + 1 === totalPairs) clearTimeout(timerRef.current);
      } else {
        setTimeout(() => {
          updatedCards[selected[0]].flipped = false;
          updatedCards[index].flipped = false;
          setCards(updatedCards);
          setSelected([]);
          setDisableDeck(false);
        }, 1000);
      }
    }
  }

  return (
    <div className="wrapper">
      <ul className="cards">
        {cards.map((card, idx) => (
          <li
            key={card.id}
            className={`card ${card.flipped ? "flip" : ""}`}
            onClick={() => flipCard(idx)}
          >
            <div className="view front-view">
              <Image src="/images/que_icon.svg" alt="icon" width={17} height={17} />
            </div>
            <div className="view back-view">
              <Image src={card.img} alt="card-img" width={40} height={40} />
            </div>
          </li>
        ))}
        <div className="details">
          <p className="time">Time: <span><b>{timeLeft}</b>s</span></p>
          <p className="flips">Flips: <span><b>{flips}</b></span></p>
          <button onClick={shuffleCards}>Refresh</button>
        </div>
      </ul>
    </div>
  );
}
