import React, { useState } from 'react';
import { AutoComplete, Input, Typography, Row, Col, message } from 'antd';
import './App.css';
import api from './utils/api';
import parse from 'html-react-parser';


const { TextArea } = Input;
const { Title } = Typography;

const App = () => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');

  const handleSearch = (value) => {
    const values = value.split(' ');
    const currentTypedValue = values[values.length - 1];
    if(currentTypedValue.includes('#')) {
      const typedText = currentTypedValue.slice(1);
      api('tag', 'GET', null, { type: 'tag', tag: typedText}).then(response => {
        const options = [];
        response.data.list.map(item => {
          options.push({value: parse(item)});
        })
        setOptions(options);
      })
    }
  };

  const onSelect = (value) => {
    const selectedValue = `${value[0].props.children}${value[1]}`
    console.log('onSelect', selectedValue);
    message.info(`your selected item is: ${selectedValue}`)
  };

  const onChange = value => {
    if(Array.isArray(value)) {
    debugger
    console.log(value, "value");
      const selectedValue = `${value[0].props.children}${value[1]}`;
      setSelectedValue(prevValue => `${prevValue} ${selectedValue}`);
    }else{
      setSelectedValue(value);
    }
  }

  return (
    <>    
    <Row justify='center' className='hashArea__title'>
      <Col span={4} style={{paddingLeft:45}}>
        <Title>Hash Select</Title>
      </Col>
    </Row>
    <Row justify='center'>
      <Col span={4}>
        <AutoComplete
          options={options}
          className='w-100'
          onSelect={onSelect}
          onSearch={handleSearch}
          onChange={onChange}
          value={selectedValue}
        >
          <TextArea
            placeholder="input here"
            className="custom"
            value={selectedValue}
          />
        </AutoComplete>
      </Col>
    </Row>

    </>
  );
};

export default App;