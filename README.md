# 칼로리 계산 웹사이트
https://nutrition365.netlify.app/

## 목차
1. [개요](#개요)
2. [과정](#과정)  
  2.1. [검색기능 만들기](#검색기능-만들기)  
  2.2. [검색한 음식 추가하기](#검색한-음식-추가하기)  
  2.3. [선택한 음식 삭제하기](#선택한-음식-삭제하기)  
  2.4. [합산 영양소 데이터 만들기](#합산-영양소-데이터-만들기)  
  2.4. [표 만들기](#표-만들기)  
  2.5. [번역](#번역)  
3. [사용한 라이브러리](#사용한-라이브러리)
4. 
## 개요
React, Axios, Nutritionix API를 사용한 칼로리 계산 웹사이트입니다. 아침, 점심, 저녁 별로 음식을 추가할 수 있으며 칼로리와 영양소가 계산되어 차트에 표시됩니다.
![제목 없음](https://user-images.githubusercontent.com/37141223/158120740-dc533ba9-7daf-4bde-84dd-043c6b161eb4.png)

Add 버튼을 누르면 음식을 추가할 수 있습니다.
![제목 없음](https://user-images.githubusercontent.com/37141223/158121314-ca8819f8-3c0c-4f5b-be71-01e7c1152b0b.png)

음식을 추가하면 칼로리와 여러가지 영양소가 표시됩니다.
![제목 없음](https://user-images.githubusercontent.com/37141223/158121536-7eb21b06-e524-4e6c-8771-c62ceda8f6ee.png)

## 과정
### 검색기능 만들기
음식을 입력 후 엔터나 검색을 클릭하면 useState를 사용해서 입력한 값이 `food` 변수로 들어갑니다.  
`useEffect`는 axios post형식으로 요청하여 `food`의 api 데이터를 받습니다. 데이터는 `useState`의 `data` 변수로 들어갑니다. 
```javascript
useEffect(()=>{
  axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {"query":`${food}`} ,{
    headers: {
      'x-app-id': '272a6433',
      'x-app-key': 'a4df3a4b2906a44557ec176501f6825c'
      }
  })
  .then(res=>{
    setData(res.data)
    setLoading(true);
  })
}, [enter])

const onChange =(e)=>{
  setInput(e.target.value);
  setText(e.target.value);
}
const onChangeNumber =(e)=>{
  setCount(e.target.value);
}
const handleKeyPress =(e)=>{
  if(e.key === 'Enter'){
    if(input === ''){
      alert('입력해주세요.')
    }else{
      setFood(text);
      setAddCurrent(true);
      setEnter(enter+1);
      setLoading(false);
    }
  }
}
const onSearch =()=>{
  setFood(text);
  setAddCurrent(true);
  setEnter(enter+1);
  setLoading(false);
}
```
### 검색한 음식 추가하기
음식을 추가하면 `foodData`에 현재 음식의 영양소의 배열이 들어오게 되고 `concat`함수는 `foodData`를 `arr`배열에 추가합니다. `arr`배열에는 음식을 추가할 때마다 `foodData` 배열이 추가됩니다.  
아침인지 점심인지 저녁인지 `if`문으로 나누어 각각의 배열에 `foodData`가 들어가게 되고 그 배열은 추가한 음식의 목록을 형성합니다. 
```javascript
const Add =()=>{
  if(input === ''){
    alert('입력해주세요.')
  }else{
    const foodData = {
      food_name : data.foods?.[0].food_name,
      calories : data.foods?.[0].nf_calories * count,
      cholesterol : data.foods?.[0].nf_cholesterol,
      dietary_fiber : data.foods?.[0].nf_dietary_fiber,
      potassium : data.foods?.[0].nf_potassium,
      protein : data.foods?.[0].nf_protein,
      saturated_fat : data.foods?.[0].nf_saturated_fat,
      sodium : data.foods?.[0].nf_sodium,
      total_carbohydrate : data.foods?.[0].nf_total_carbohydrate,
      total_fat : data.foods?.[0].nf_total_fat,
      calcium : data.foods?.[0].full_nutrients?.[19].value,
      id : data.foods?.[0].consumed_at,
      count : count,
    }
    setArr(arr.concat(foodData));
    console.log(data.foods)
    if(time==='breakfast'){
      setBreakfast(breakfast.concat(foodData));
    }
    if(time==='lunch'){
      setLunch(lunch.concat(foodData));
    }
    if(time==='dinner'){
      setDinner(dinner.concat(foodData));
    }
    setPop(false);
    setInput('');
    setLoading(false);
    setCount(1);
    setAddCurrent(false);
  }
}
```
### 선택한 음식 삭제하기
추가한 음식 목록에서 `delete`버튼을 누르면 삭제가 되는데 이때 `filter`함수는 선택한 음식의 `id`를 제외한 나머지 배열들만 반환하여 목록을 형성합니다.
```javascript
const onRemove =(item)=>{
    setArr(arr.filter(cur => cur.id !== item.id));
    setBreakfast(breakfast.filter(cur => cur.id !== item.id));
    setLunch(lunch.filter(cur => cur.id !== item.id));
    setDinner(dinner.filter(cur => cur.id !== item.id));
}
```
### 합산 영양소 데이터 만들기
`reduce`함수는 `arr`배열의 각 영양소의 누적 합산결과를 반환합니다.
```javascript
const calories = arr.reduce((acc, cur)=>{
  return Math.round((acc + cur.calories) * 100)/100
},0)
const cholesterol = arr.reduce((acc, cur)=>{
  return Math.round((acc + cur.cholesterol) * 100)/100
},0)
const dietary_fiber = arr.reduce((acc, cur)=>{
  return Math.round((acc + cur.dietary_fiber) * 100)/100
},0)
const potassium = arr.reduce((acc, cur)=>{
  return Math.round((acc + cur.potassium) * 100)/100
},0)
const protein = arr.reduce((acc, cur)=>{
  return Math.round((acc + cur.protein) * 100)/100
},0)
const saturated_fat = arr.reduce((acc, cur)=>{
  return Math.round((acc + cur.saturated_fat) * 100)/100
},0)
const sodium = arr.reduce((acc, cur)=>{
  return Math.round((acc + cur.sodium) * 100)/100
},0)
const total_carbohydrate = arr.reduce((acc, cur)=>{
  return Math.round((acc + cur.total_carbohydrate) * 100)/100
},0)
const total_fat = arr.reduce((acc, cur)=>{
  return Math.round((acc + cur.total_fat) * 100)/100
},0)
const calcium = arr.reduce((acc, cur)=>{
  return Math.round((acc + cur.calcium) * 100)/100
},0)
```
### 차트에 데이터 넣기
최종 합산된 영양소들은 차트 옵션의 `data`로 들어갑니다.
```javascript
const state = {
  series: [{
  name: 'carbohydrate',
  data: [total_carbohydrate, 5]
}, {
  name: 'protein',
  data: [protein, 3]
}, {
  name: 'fat',
  data: [total_fat, 2]
}],
  chart: {
  type: 'bar',
  stacked: true,
  stackType: '100%',
  toolbar:{
    show: false,
  }
},
plotOptions: {
  bar: {
    horizontal: true,
    barHeight: '10%',
  },
},
colors: ['#2658FC', '#6186FF', '#26E7A6'],
grid:{
  show: false,
},
xaxis: {
  categories: ['current', 'recommend'],
  show: false,
},
tooltip: {
  y: {
    formatter: function (val) {
      return val + "g"
    }
  }
},
fill: {
  opacity: 1

},
legend: {
  position: 'bottom',
  horizontalAlign: 'center',
}
};

const state2 = {
  series: [{
    name: 'status',
    data: [total_carbohydrate, protein, dietary_fiber, saturated_fat, total_fat, potassium/1000, sodium/1000, saturated_fat, calcium/1000]
    }],
  chart: {
  type: 'bar',
  events: {
    click: function(chart, w, e) {
      // console.log(chart, w, e)
    }
  },
  toolbar: {
    show: false,
  }
},
colors: ['#003AF9'],
grid: {
  show: false,
},
plotOptions: {
  bar: {
    columnWidth: '15%',
    distributed: true,
  }
},
dataLabels: {
  enabled: false
},
legend: {
  show: false
},
tooltip: {
  y: {
    formatter: function (val) {
      return Math.round(val*100)/100 + "g"
    }
  }
},
xaxis: {
  categories: ['carbohydrate', 'protein', 'dietary fiber', 'saturated fat', 'fat', 'potassium', 'sodium', 'saturated fat', 'calcium'],
  labels: {
    style: {
      fontSize: '12px'
    }
  }
},
yaxis: {
  show: false,
}
};
```
## 사용한 라이브러리
`react` `axios` `react-bootstrap` `apexcharts`
