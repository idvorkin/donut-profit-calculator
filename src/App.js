
import React, { useState, useMemo } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

const SliderWithLabel = ({ label, value, onChange, min, max, step, marks }) => (
  <div className="input-group">
    <label>{label}: {value}</label>
    <Slider
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      marks={marks}
    />
  </div>
);

function App() {
  const [inputs, setInputs] = useState({
    donutPrice: 2.5,
    ingredientCost: 0.5,
    laborCost: 15,
    laborHours: 8,
    overhead: 200,
    donutsMade: 500,
    normalSales: 400,
    busySales: 600,
    busyDayFrequency: 0.2,
  });

  const handleSliderChange = (name) => (value) => {
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };

  const calculations = useMemo(() => {
    const {
      donutPrice,
      ingredientCost,
      laborCost,
      laborHours,
      overhead,
      donutsMade,
      normalSales,
      busySales,
      busyDayFrequency
    } = inputs;

    const totalDailyCost = (ingredientCost * donutsMade) + (laborCost * laborHours) + overhead;
    const revenueNormal = donutPrice * Math.min(donutsMade, normalSales);
    const revenueBusy = donutPrice * Math.min(donutsMade, busySales);
    const profitNormal = revenueNormal - totalDailyCost;
    const profitBusy = revenueBusy - totalDailyCost;
    const expectedDailyProfit = (1 - busyDayFrequency) * profitNormal + busyDayFrequency * profitBusy;
    const breakEvenDonuts = donutPrice > 0 ? Math.ceil(totalDailyCost / donutPrice) : 0;

    return {
      totalDailyCost,
      revenueNormal,
      revenueBusy,
      profitNormal,
      profitBusy,
      expectedDailyProfit,
      breakEvenDonuts,
    };
  }, [inputs]);

  const chartData = useMemo(() => {
    const data = [];
    const { donutPrice, ingredientCost, laborCost, laborHours, overhead, normalSales, busySales, busyDayFrequency } = inputs;

    for (let donuts = 0; donuts <= Math.max(1000, inputs.donutsMade * 1.5); donuts += 25) {
      const totalDailyCost = (ingredientCost * donuts) + (laborCost * laborHours) + overhead;
      const revenueNormal = donutPrice * Math.min(donuts, normalSales);
      const revenueBusy = donutPrice * Math.min(donuts, busySales);
      const profitNormal = revenueNormal - totalDailyCost;
      const profitBusy = revenueBusy - totalDailyCost;
      
      const expectedProfitCurrentFreq = ((1 - busyDayFrequency) * profitNormal + busyDayFrequency * profitBusy).toFixed(0);
      
      const higherFreq = Math.min(1, busyDayFrequency + 0.2);
      const expectedProfitHigherFreq = ((1 - higherFreq) * profitNormal + higherFreq * profitBusy).toFixed(0);

      data.push({
        donutsMade: donuts,
        profitCurrentFreq: expectedProfitCurrentFreq,
        profitHigherFreq: expectedProfitHigherFreq,
      });
    }
    return data;
  }, [inputs]);


  return (
    <div className="App">
      <header className="App-header">
        <h1>Donut Shop Profit Calculator</h1>
      </header>
      <main>
        <div className="controls-container">
          <div className="input-form">
            <h2>Inputs</h2>
            <SliderWithLabel label="Donut Sale Price" value={inputs.donutPrice} onChange={handleSliderChange('donutPrice')} min={0.5} max={5} step={0.1} />
            <SliderWithLabel label="Ingredient Cost per Donut" value={inputs.ingredientCost} onChange={handleSliderChange('ingredientCost')} min={0.1} max={2} step={0.05} />
            <SliderWithLabel label="Labor Cost per Hour" value={inputs.laborCost} onChange={handleSliderChange('laborCost')} min={10} max={50} step={1} />
            <SliderWithLabel label="Hours of Labor per Day" value={inputs.laborHours} onChange={handleSliderChange('laborHours')} min={1} max={24} step={1} />
            <SliderWithLabel label="Overhead Cost per Day" value={inputs.overhead} onChange={handleSliderChange('overhead')} min={0} max={1000} step={10} />
            <SliderWithLabel label="Donuts Made per Day" value={inputs.donutsMade} onChange={handleSliderChange('donutsMade')} min={0} max={1500} step={10} />
            <SliderWithLabel label="Normal Day Sales Volume" value={inputs.normalSales} onChange={handleSliderChange('normalSales')} min={0} max={1500} step={10} />
            <SliderWithLabel label="Busy Day Sales Volume" value={inputs.busySales} onChange={handleSliderChange('busySales')} min={0} max={1500} step={10} />
            <SliderWithLabel label="Frequency of Busy Days" value={inputs.busyDayFrequency} onChange={handleSliderChange('busyDayFrequency')} min={0} max={1} step={0.01} />
          </div>
          <div className="summary-panel">
            <h2>Summary</h2>
            <p>Total Daily Cost: <span>${calculations.totalDailyCost.toFixed(2)}</span></p>
            <p>Revenue (Normal Day): <span>${calculations.revenueNormal.toFixed(2)}</span></p>
            <p>Revenue (Busy Day): <span>${calculations.revenueBusy.toFixed(2)}</span></p>
            <p style={{color: calculations.profitNormal < 0 ? 'red' : 'green'}}>Profit (Normal Day): <span>${calculations.profitNormal.toFixed(2)}</span></p>
            <p style={{color: calculations.profitBusy < 0 ? 'red' : 'green'}}>Profit (Busy Day): <span>${calculations.profitBusy.toFixed(2)}</span></p>
            <p style={{color: calculations.expectedDailyProfit < 0 ? 'red' : 'green', fontWeight: 'bold'}}>Expected Daily Profit: <span>${calculations.expectedDailyProfit.toFixed(2)}</span></p>
            <p>Break-Even Donuts: <span>{calculations.breakEvenDonuts}</span></p>
          </div>
        </div>
        <div className="chart-container">
          <h2>Profit vs. Donuts Made</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="donutsMade" name="Donuts Made" label={{ value: 'Donuts Made per Day', position: 'insideBottom', offset: -15 }} />
              <YAxis name="Profit" label={{ value: 'Expected Daily Profit ($)', angle: -90, position: 'insideLeft', offset: -10 }}/>
              <Tooltip formatter={(value, name) => [`$${value}`, name]} />
              <Legend verticalAlign="top" />
              <Line type="monotone" dataKey="profitCurrentFreq" name={`Expected Profit (at ${Math.round(inputs.busyDayFrequency * 100)}% busy freq.)`} stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="profitHigherFreq" name={`Expected Profit (at ${Math.round(Math.min(1, inputs.busyDayFrequency + 0.2) * 100)}% busy freq.)`} stroke="#82ca9d" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}

export default App;
