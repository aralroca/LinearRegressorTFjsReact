import React, { Component } from 'react';
import LinearModelClass from '../classes/LinearModel';
import uuid from 'uuid';

const isValid = num => typeof num === 'number' && !Number.isNaN(num);

export default class LinearModel extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataset: [],
      training: false,
      completed: false,
    }
    this.linearModel = new LinearModelClass();
    this.onAdd = this.onAdd.bind(this);
    this.onPredict = this.onPredict.bind(this);
    this.onTrainModel = this.onTrainModel.bind(this);
    this.comeBack = this.comeBack.bind(this);
  }

  onAdd(event){
    const x = parseFloat(this.x.value);
    const y = parseFloat(this.y.value);

    event.preventDefault();

    if(!isValid(x)){
      this.setState({ error: 'X is not a valid number'});
      return;
    }

    if(!isValid(y)){
      this.setState({ error: 'Y is not a valid number'});
      return;
    }
    const newValues = { id: uuid(), x, y };
    this.x.value = undefined;
    this.y.value = undefined;

    this.setState({
      dataset: [...this.state.dataset, newValues],
      error: '',
    })
  }

  onPredict(){
    const input = parseFloat(this.toPredict.value);

    if(!isValid(input)){
       this.setState({ error: 'Input from prediction is not a valid number'});
       return;
    }

    this.setState({
      prediction: this.linearModel.predict(input),
      error: '',
    });
  }

  onTrainModel(){
    const xs = this.state.dataset.map(data => data.x);
    const ys = this.state.dataset.map(data => data.y);

    this.setState({ training: true, prediction: undefined }, () => {
      this.linearModel.trainModel(xs, ys).then(() => {
         this.setState({ completed: true, training: false, error: '' })
      })
    });
  }

  onRemove(index){
    const dataset = this.state.dataset.slice();

    dataset.splice(index, 1);

    this.setState({ dataset });
  }

  comeBack(){
    this.setState({ completed: false });
  }

  renderTraining(){
    return (
      <div>
        <h2>Train a linear model</h2>
        <form onSubmit={this.onAdd}>
          <label>X:</label>
          <input
            type="number" 
            ref={el => { this.x = el; }} 
          />
          <label>Y:</label>
          <input 
            type="number" 
            ref={el => { this.y = el; }} 
          />
          <button type="submit">Add</button>
         <p className="error">{this.state.error}</p>
        </form>
        {this.state.dataset.map((item, index) => (
          <div className="dataset" key={`dataset-${item.id}`}>
            <span><b>X:</b> {item.x}, <b>Y:</b> {item.y}</span>
            <button className="remove" onClick={() => this.onRemove(index)}>Remove</button>
          </div>
        ))}
        {this.state.dataset.length > 2 
        ? (
           <button 
            className="train"
            onClick={this.onTrainModel} 
            disabled={this.state.training}
          >
            {this.state.training ? 'Training' : 'Do Training!'}
          </button>
        )
        : (
          <span className="info">
            Please, add at least 3 elements into the dataset
          </span>
        )}
      </div>
    )
  }

  renderPrediction(){
    return (
      <div>
        <h2>Trained! Now fill the X to predict the Y</h2>
        <input type="number" ref={el => { this.toPredict = el}} />
        <button onClick={this.onPredict}>Predict</button>
        <button onClick={this.comeBack}>Come back to train page</button>

        {this.state.prediction && (
          <p>
            <b>Prediction:</b> {this.state.prediction}
          </p>
        )}
      </div>
    )
  }

  render(){
    return this.state.completed
      ? this.renderPrediction()
      : this.renderTraining();
  }
}
