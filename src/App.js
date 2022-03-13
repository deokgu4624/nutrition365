import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Form, InputGroup, Button, Container, Row, Col, Spinner, Card, CloseButton, Table } from 'react-bootstrap';
import { motion } from "framer-motion"
import ReactApexChart from 'react-apexcharts';
import img from '../src/img.svg'
import salad from '../src/salad.png'

function App() {
  const [data, setData] = useState([]);
  const [text, setText] = useState();
  const [food, setFood] = useState();
  const [arr, setArr] = useState([]);
  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [time, setTime] = useState();
  const [count, setCount] = useState(1);
  const [pop, setPop] = useState(false);
  const [input, setInput] = useState('');
  const [addCurrent, setAddCurrent] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [enter, setEnter] = useState(0);
  const popSection = useRef();

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
  const onRemove =(item)=>{
      setArr(arr.filter(cur => cur.id !== item.id));
      setBreakfast(breakfast.filter(cur => cur.id !== item.id));
      setLunch(lunch.filter(cur => cur.id !== item.id));
      setDinner(dinner.filter(cur => cur.id !== item.id));
  }
  const onClose =()=>{
      setPop(false);
      setInput('');
      setLoading(false);
      setCount(1);
      setAddCurrent(false);
  }

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

  return (
    <>
      <Container className={'container'}>
        <nav>
          <img className='logo' src={salad} alt='logo' />
          <p className='title'>Nutrition365</p>
        </nav>
        <section>
          <Row>
            <Col md={6} lg={6} xl={3}>
              <Card className={'imgWrapper'}>
                <h5 style={{margin:0}}>Welcome!</h5>
                <p style={{marginBottom: '10px'}}>please calculate nutritions.</p>
                <h5>Today's calories</h5>
                <h1>{calories}kcal</h1>
                <Card.Body>
                  <img src={img} alt='img' />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={6} xl={3}>
              <Card>
                <Card.Body>
                  <h5>Overview</h5>
                  <ReactApexChart options={state} series={state.series} type="bar" height={360} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} lg={12} xl={6}>
              <Card>
                <Card.Body>
                  <h5>Current Status</h5>
                  <ReactApexChart options={state2} series={state2.series} type="bar" height={360} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
        <section>
              <Card className={'addFood'}>
                <Card.Body>
                  <h5>Breakfast</h5>
                  <Table hover>
                    <tbody>
                      <tr>
                        <td>Qty</td>
                        <td>Food</td>
                        <td>Calories</td>
                        <td></td>
                      </tr>
                      {breakfast.map((item, index)=>{
                        return(
                          <tr key={index}><td>{item.count}</td><td>{item.food_name}</td><td>{item.calories}</td><td><Button variant="light" onClick={()=>{onRemove(item)}}>delete</Button></td></tr>
                        )
                      })}
                    </tbody>
                  </Table>
                  <Button onClick={()=>{setTime('breakfast'); setPop(true)}}>+ Add</Button>
                </Card.Body>
              </Card>
              <Card className={'addFood'}>
                <Card.Body>
                  <h5>Lunch</h5>
                  <Table hover>
                    <tbody>
                      <tr>
                        <td>Qty</td>
                        <td>Food</td>
                        <td>Calories</td>
                        <td></td>
                      </tr>
                      {lunch.map((item, index)=>{
                        return(
                          <tr key={index}><td>{item.count}</td><td>{item.food_name}</td><td>{item.calories}</td><td><Button variant="light" onClick={()=>{onRemove(item)}}>delete</Button></td></tr>
                        )
                      })}
                    </tbody>
                  </Table>
                  <Button onClick={()=>{setTime('lunch'); setPop(true)}}>+ Add</Button>
                </Card.Body>
              </Card>
              <Card className={'addFood'} style={{marginBottom:'50px'}}>
                <Card.Body>
                  <h5>Dinner</h5>
                  <Table hover>
                    <tbody>
                      <tr>
                        <td>Qty</td>
                        <td>Food</td>
                        <td>Calories</td>
                        <td></td>
                      </tr>
                      {dinner.map((item, index)=>{
                        return(
                          <tr key={index}><td>{item.count}</td><td>{item.food_name}</td><td>{item.calories}</td><td><Button variant="light" onClick={()=>{onRemove(item)}}>delete</Button></td></tr>
                        )
                      })}
                    </tbody>
                  </Table>
                  <Button onClick={()=>{setTime('dinner'); setPop(true)}}>+ Add</Button>
                </Card.Body>
              </Card>
        </section>
      </Container>
      <motion.section
        ref={popSection}
        initial={{y: 300}}
        animate={{y: pop ? 0 : 300}}
        className={'search'}
      >
        <Container>
          <Row className='justify-content-center'>
            <Col md={12} xl={6}>
              <Card className='pop'>
                <Card.Header className={'cardHeader'}>
                  <CloseButton onClick={onClose} className={'closeButton'}/>
                </Card.Header>
                <Card.Body>
                  <InputGroup className="mb-3">
                    <Form.Control value={input} onChange={onChange} onKeyPress={handleKeyPress}/>
                    <InputGroup.Text className={'searchBtn'} variant="light" onClick={onSearch}>Search</InputGroup.Text>
                  </InputGroup>
                  <motion.div
                    initial={{visibility:'hidden'}}
                    animate={{visibility: addCurrent ? 'visible' : 'hidden'}}
                  >
                    <Row>
                      <Col md={5}>
                        {isLoading ? <Card style={{margin: '7px 0', boxShadow: 'none'}}>{data.foods?.[0].food_name} {data.foods?.[0].nf_calories * count}kcal</Card> : <Spinner animation="border" />}
                      </Col>
                      <Col md={4}>
                        <InputGroup className="mb-3">
                          <InputGroup.Text className={'count'} onClick={()=>{setCount(count-1)}}>-</InputGroup.Text>
                          <Form.Control value={count} onChange={onChangeNumber} />
                          <InputGroup.Text className={'count'} onClick={()=>{setCount(count+1)}}>+</InputGroup.Text>
                        </InputGroup>
                      </Col>
                      <Col md={3}>
                        <Button className={'add'} onClick={Add}>Add</Button>
                      </Col>
                    </Row>
                  </motion.div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </motion.section>
    </>
  );
}

export default App;
