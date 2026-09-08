---
title: 箕面ハイキングマップ
date: 2026-01-15
category: ハイキングアプリ
summary: 紙のハイキングマップを国土地理院地図に重ね合わせ、現在地とルートを確認できるWebアプリ。
tags:
  - Leaflet.js
  - Firebase
  - PWA
thumbnail: thumbnail.png
repo: https://github.com/sato4app/minoh-hiking
demo: https://sato4app.github.io/minoh-hiking/
---

## 概要

紙のハイキングマップ（PNG画像）を国土地理院地図の上に正確に重ね合わせ、
GPSによる現在地とあわせて表示するWebアプリです。

![スクリーンショット](thumbnail.png)

## 主な機能

- 最小二乗法による6パラメータアフィン変換でのジオリファレンス
- 国土地理院タイルへの画像オーバーレイ
- ルート・スポットの表示と標高情報の取得
- PWA対応によるオフライン利用

## 使用技術

| 分類 | 技術 |
| --- | --- |
| 地図 | Leaflet.js / 国土地理院タイル |
| バックエンド | Firebase Firestore |
| その他 | Service Worker |
