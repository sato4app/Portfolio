---
title: GNSSスコープ
date: 2025-11-02
category: 電子工作
summary: GNSSモジュールの測位状況をリアルタイムに可視化する自作の計測ツール。
tags:
  - GNSS
  - Arduino
  - 電子工作
thumbnail: circuit.png
repo: https://github.com/sato4app/gnss-scope
---

## 概要

GNSSモジュールから出力されるNMEAセンテンスを解析し、
受信衛星の配置と信号強度をリアルタイムに表示する計測ツールです。

![回路図](circuit.png)

## 主な機能

- NMEAセンテンスのパースと衛星情報の抽出
- 衛星配置図（スカイプロット）の描画
- 信号強度（C/N比）のバーグラフ表示

## 構成

- GNSSモジュール（UART接続）
- マイコンボード
- 表示用ディスプレイ
