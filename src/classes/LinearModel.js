import * as tf from '@tensorflow/tfjs';

export default class LinearModel {
  async trainModel(xs, ys){
    const layers = tf.layers.dense({
      units: 1,
      inputShape: [1],
    });
    const lossAndOptimizer = {
      loss: 'meanSquaredError',
      optimizer: 'sgd',
    };

    this.linearModel = tf.sequential();
    this.linearModel.add(layers);
    this.linearModel.compile(lossAndOptimizer);
    
    await this.linearModel.fit(
      tf.tensor1d(xs),
      tf.tensor1d(ys),
    );
  }

  predict(value){
    return Array.from(
      this.linearModel
      .predict(tf.tensor2d([value], [1, 1]))
      .dataSync()
    )
  }
}
