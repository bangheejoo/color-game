import { useState, useCallback } from 'react';
import {
  collection, addDoc, getDocs,
  query, orderBy, limit, where,
  serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { RankEntry } from '../types';

const COLLECTION = 'rankings';

function toDate(ts: unknown): Date {
  if (ts instanceof Timestamp) return ts.toDate();
  if (ts instanceof Date) return ts;
  return new Date();
}

export function useLeaderboard() {
  const [overallRanks, setOverallRanks] = useState<RankEntry[]>([]);
  const [todayRanks, setTodayRanks] = useState<RankEntry[]>([]);
  const [comboRanks, setComboRanks] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 종합 순위 (전체 기간 점수 Top 10) */
  const fetchOverallRanks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, COLLECTION),
        orderBy('score', 'desc'),
        limit(10),
      );
      const snap = await getDocs(q);
      setOverallRanks(
        snap.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            nickname: d.nickname,
            score: d.score,
            levelReached: d.levelReached,
            maxCombo: d.maxCombo ?? 0,
            isPerfect: d.isPerfect ?? false,
            date: toDate(d.date),
          };
        }),
      );
    } catch (e) {
      console.error('종합 순위 로드 실패:', e);
      setError('순위를 불러올 수 없어요요');
    } finally {
      setLoading(false);
    }
  }, []);

  /** 오늘의 순위 (오늘 날짜 기록 중 점수 Top 20) */
  const fetchTodayRanks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      // Firestore는 inequality filter 필드를 첫 번째 orderBy로 강제 →
      // date 기준으로 오늘 데이터를 가져온 뒤 클라이언트에서 점수순 정렬
      const q = query(
        collection(db, COLLECTION),
        where('date', '>=', Timestamp.fromDate(todayStart)),
        orderBy('date', 'asc'),
        limit(200), // 오늘치 전체를 가져와 클라이언트 정렬
      );
      const snap = await getDocs(q);
      const all = snap.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          nickname: d.nickname,
          score: d.score,
          levelReached: d.levelReached,
          maxCombo: d.maxCombo ?? 0,
          isPerfect: d.isPerfect ?? false,
          date: toDate(d.date),
        };
      });
      // 점수 내림차순 정렬 후 상위 10개
      all.sort((a, b) => b.score - a.score);
      setTodayRanks(all.slice(0, 10));
    } catch (e) {
      console.error('오늘의 순위 로드 실패:', e);
      setError('순위를 불러올 수 없어요');
    } finally {
      setLoading(false);
    }
  }, []);

  /** 최고 콤보 순위 (콤보 Top 10) */
  const fetchComboRanks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, COLLECTION),
        orderBy('maxCombo', 'desc'),
        orderBy('score', 'desc'),
        limit(10),
      );
      const snap = await getDocs(q);
      setComboRanks(
        snap.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            nickname: d.nickname,
            score: d.score,
            levelReached: d.levelReached,
            maxCombo: d.maxCombo ?? 0,
            isPerfect: d.isPerfect ?? false,
            date: toDate(d.date),
          };
        }),
      );
    } catch (e) {
      console.error('콤보 순위 로드 실패:', e);
      setError('순위를 불러올 수 없어요');
    } finally {
      setLoading(false);
    }
  }, []);

  /** 점수 저장 */
  const saveScore = useCallback(async (
    nickname: string,
    score: number,
    levelReached: number,
    maxCombo: number,
    isPerfect: boolean,
  ): Promise<boolean> => {
    try {
      await addDoc(collection(db, COLLECTION), {
        nickname: nickname.trim() || '익명',
        score,
        levelReached,
        maxCombo,
        isPerfect,
        date: serverTimestamp(),
      });
      return true;
    } catch (e) {
      console.error('점수 저장 실패:', e);
      return false;
    }
  }, []);

  return { overallRanks, todayRanks, comboRanks, loading, error, fetchOverallRanks, fetchTodayRanks, fetchComboRanks, saveScore };
}
