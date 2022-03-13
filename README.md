# 주식시장 시세 사이트
http://investingqqq.netlify.app/

## 목차
1. [개요](#개요)
2. [과정](#과정)  
  2.1. [Axios로 데이터 받아오기](#axios로-데이터-받아오기)  
  2.2. [필요한 데이터 가공](#필요한-데이터-가공)  
  2.3. [차트에 데이터 넣기](#차트에-데이터-넣기)  
  2.4. [표 만들기](#표-만들기)  
  2.5. [번역](#번역)  
3. [사용한 라이브러리](#사용한-라이브러리)
4. 
## 개요
React, Axios, Nutritionix API를 사용한 칼로리 계산 웹사이트입니다.
![제목 없음](https://user-images.githubusercontent.com/37141223/147278046-f695d191-5496-4217-9764-418e2cd45156.png)

확진자 추이와 최근 동향 차트입니다. 최근 동향은 7일간을 표시합니다.
![제목 없음](https://user-images.githubusercontent.com/37141223/147287373-f9a4290a-a048-4cee-980e-f6db4c4f0123.png)

국가별 현황표 입니다. 누적 확진자, 누적 사망자, 누적 격리자, 누적 완치자, 치명률을 표시합니다.
![제목 없음](https://user-images.githubusercontent.com/37141223/147287926-f5bd47be-ed3f-4ec4-ade6-2b57dba2aa74.png)

## 과정
### Axios로 데이터 받아오기
`useEffect`는 axios로 api 데이터를 받습니다. 데이터는 `useState`의 `data` 변수로 들어갑니다.
```javascript
useEffect(()=>{
  axios.get('https://api.covid19api.com/total/dayone/country/'+props.country)
            .then(res =>{
              setData(res.data);
              setLoading(false);
            })
  },[props])
```
### 필요한 데이터 가공
대시보드에 표시될 수치 데이터입니다. `reduce`함수는 원하는 분류들을 새 배열에 넣어주고 `map`함수는 한가지 분류로만 이루어진 배열을 만듭니다.
```javascript
const cardData = Data.reduce(function(acc, cur){
  const confirmed = cur.Confirmed;
  const active = cur.Active;
  const deaths = cur.Deaths;
  const recovered = cur.Recovered;
  const date = cur.Date;
acc.push({confirmed, active, deaths, recovered, date})
  return acc;
}, [])
const cardConfirmed = cardData.map(function(item){
  return item.confirmed;
})
const cardActive = cardData.map(function(item){
  return item.active;
})
const cardDeaths = cardData.map(function(item){
  return item.deaths;
})
const cardRecovered = cardData.map(function(item){
  return item.recovered;
})
const cardDate = cardData.map(function(item){
  return item.date;
})
```
차트에 들어갈 데이터입니다. 데이터는 동일하게 `reduce`와 `map`함수로 정리됩니다.
```javascript
const arr = Data.reduce(function(acc, cur){
    const currentDate = new Date(cur.Date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    const confirmed = cur.Confirmed;
    const active = cur.Active;
    const deaths = cur.Deaths;
    const recovered = cur.Recovered;
    if(date === 1){
      acc.push({year, month, date, confirmed, active, deaths, recovered, currentDate:cur.Date})
    }
  return acc;
}, [])
const confirmed = arr.map(function(item){
  return item.confirmed;
})
const recentConfirmed = cardConfirmed.slice(-9, -1);
const getToday = recentConfirmed.map(function(item, index, array){
    const arr = array[index+1]-array[index];
  return arr
})
const recentMovement =getToday.slice(0,7);
const active = arr.map(function(item){
  return item.active;
})
const deaths = arr.map(function(item){
  return item.deaths;
})
const recovered = arr.map(function(item){
  return item.recovered;
})
const currentDate = arr.map(function(item){
  return item.currentDate;
})
```
### 차트에 데이터 넣기
`apexcharts` 라이브러리를 사용한 area 차트입니다. 분류해놓은 배열들이 각각 data에 들어갑니다. 차트 옵션중에서는 `yaxis`->`labes` 단위가 1000명기준으로 변경되었습니다.
```javascript
const series1 = [{
  name: '확진자',
  data: confirmed
}, {
  name: '격리자',
  data: active
}];
const series2 = [{
  name: '사망자',
  data: deaths
}]
const series3 = [{
  name: '일일 확진자',
  data: recentMovement
}];
const options = {
  chart: {
    height: 350,
    type: 'area',
    toolbar: {
      show: false}
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    type: 'datetime',
    categories: currentDate
  },
  yaxis: {
    labels: {
      formatter: function (value) {
        return value/1000 + "K";
      }
    },
  },
  tooltip: {
    x: {
      format: 'yy/MM/dd'
    },
    y: {
      formatter: function(value) {
        return value
      }
    }
  },
}
```
### 표 만들기
표 데이터는 각각 `map`함수를 사용해서 `<div>`태그로  카테고리 아래로 쭉 나열됩니다. 국가명에 t는 아래 후술하는 `i18next`라이브러리의 문법입니다.
```javascript
<div className={styles.countryName}>
    <div className={styles.category}>국가명</div>
    {props.data.map(el => {
        return (<div key={el.country} className={styles.country}>
            {t(el.country)}
        </div>)
    })}
</div>
<div className={styles.cases}>
    <div className={styles.category}>확진자</div>
    {props.data.map(el => {
        return (<div key={el.country} className={styles.country}>
            {el.cases}
        </div>)
    })}
</div>
<div className={styles.deaths}>
    <div className={styles.category}>사망자</div>
    {props.data.map(el => {
        return (<div key={el.country} className={styles.country}>
            {el.deaths}
        </div>)
    })}
</div>
<div className={styles.active}>
    <div className={styles.category}>격리자</div>
    {props.data.map(el => {
        return (<div key={el.country} className={styles.country}>
            {el.active}
        </div>)
    })}
</div>
<div className={styles.recovered}>
    <div className={styles.category}>완치자</div>
    {props.data.map(el => {
        return (<div key={el.country} className={styles.country}>
            {el.recovered}
        </div>)
    })}
</div>
<div className={styles.critical}>
    <div className={styles.category}>치명률</div>
    {props.data.map(el => {
        return (<div key={el.country} className={styles.country}>
            {Math.floor(el.deaths / el.cases * 1000)/10}%
        </div>)
    })}
</div>
```
### 번역
데이터의 국가명은 영어였기때문에 `i18next` 라이브러리로 한글명을 대응시켰습니다.
```javascript
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
            "USA": '미국',
            "India": '인도',
            "Brazil": '브라질',
            "Russia": '러시아',
            "France": '프랑스',
            "UK": '영국',
            "Turkey": '터키',
            "Argentina": '아르헨티나',
            "Colombia": '콜롬비아',
            "Spain": '스페인',
            "Italy": '이탈리아',
            "Iran": '이란',
            "Indonesia": '인도네시아',
            "Germany": '독일',
            ...
          }
      }
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    }
  });
```

## 사용한 라이브러리
`react` `axios` `react-router-dom` `react-bootstrap` `apexcharts` `i18next`
