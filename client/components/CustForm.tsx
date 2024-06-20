import React, { FC, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../public/style.css';
import { useAppSelector } from '../Redux/store';


const RedisForm: FC = (): ReactElement => {
  const sliderState = useAppSelector(state => state.slider);
  // console.log("redisState", redisState);

  return (
    <form
      id="redis-form"
      action="/api/createFiles"
      method="POST"
      className="p-0"
    >
      {/* <h1 id="redis-conf-header">redis.conf customization</h1> */}
      {/* <h2>Administration</h2> */}
    <input type='hidden' name='shards' id='shards' value={sliderState.shardsValue} />
    <input type="hidden" name="replicas" id="replicas" value={sliderState.replicasValue} />
      <div id="admin">
        {/* <div className="redis-form-input">
          <label htmlFor="shards">number of shards</label>
          <input
            type="number"
            name="shards"
            id="shards"
            value={sliderState.shardsValue}
            onChange={e => {
              dispatch(setShardsValue(e.target.value));
            }}
          />
          <label htmlFor="replicas">number of replicas</label>
          <input
            type="number"
            name="replicas"
            id="replicas"
            value={sliderState.replicasValue}
            onChange={e => {
              dispatch(setReplicasValue(e.target.value));
            }}
          />
        </div> */}

        <div className="redis-form-input">
        </div>

        <div className="redis-form-input">
          <label htmlFor="portNumber" >Port</label>
          <input name="portNumber" id="portNumber" type="number" defaultValue={6379} />
        </div>

        <div className="redis-form-input">
          <label htmlFor="masterAuth">require masterauth password?</label>
          <input name="masterAuth" id="masterAuth" type="text" />
        </div>

        <div className="redis-form-input">
          <label htmlFor="masterUser">require masteruser credentials?</label>
          <input name="masterUser" id="masterUser" type="text" />
        </div>
      </div>

      <div className="redis-form-input">
        <label htmlFor="daemonize">daemonize?</label>
        <select name="daemonize" id="daemonize">
          <option selected value="no">no</option>
          <option value="yes">yes</option>
        </select>
      </div>

      <div className="redis-form-input">
        <label htmlFor="loglevel">log setting</label>
        <select name="loglevel" id="loglevel">
          <option selected value="notice">
            notice
          </option>
          <option value="verbose">verbose</option>
          <option value="debug">debug</option>
        </select>
      </div>

      <div className="redis-form-input">
        <label htmlFor="timeout">node timeout (seconds)</label>
        <input name="timeout" id="timeout" type="number" defaultValue={0} />
      </div>

      <div id="persistance">
        <div className="redis-form-input">
          <label htmlFor="saveSeconds">minimum time between RDB snapshots (seconds)</label>
          <input name="saveSeconds" id="saveSeconds" type="number" defaultValue={0}/>
        </div>

        <div className="redis-form-input">
          <label htmlFor="saveChanges">number of changes made within time interval to trigger a snapshot</label>
          <input name="saveChanges" id="saveChanges" type="number" defaultValue={1}/>
        </div>

        <div className="redis-form-input">
          <label for="appendonly">enable appendonly (AOF) mode</label>
          <select name="appendonly" id="appendonly" type="checkbox" value={true}>
            <option selected value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>

        <div className="redis-form-input">
          <label htmlFor="appendfsync">choose an AOF sync method</label>
          <select name="appendfsync" id="appendfsync">
            <option selected value="everysec">
              everysec
            </option>
            <option value="no">no</option>
            <option value="always">always</option>
          </select>
        </div>
      </div>

      <div id="memory">
        <div className="redis-form-input">
          <label htmlFor="rdbcompression">rdb compression</label>
          <select name="rdbcompression" id="rdbcompression" type="checkbox" value={true}>
            <option selected value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>

        <div className="redis-form-input">
          <label htmlFor="rdbchecksum">redchecksum</label>
          <select name="rdbchecksum" id="rdbchecksum" type="checkbox" value={true}>
            <option selected value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>

        <div className="redis-form-input">
          <label htmlFor="replicaServeStaleData">serve stale data?</label>
          <select name="replicaServeStaleData" id="replicaServeStaleData" type="checkbox" value={true}>
            <option selected value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>

        <div className="redis-form-input">
          <label htmlFor="maxmemory">Maximum memory allowed (in bytes)</label>
          <input name="maxmemory" id="maxmemory" type="number" defaultValue={5368709120}/>
        </div>

        <div className="redis-form-input">
          <label htmlFor="maxmemoryPolicy">Maxmemory eviction policy</label>
          <select name="maxmemoryPolicy" id="maxmemoryPolicy">
            <option selected value="noeviction">
              noeviction
            </option>
            <option value="allkeys-lru">allkeys-lru</option>
            <option value="volatile-lru">volatile-lru</option>
            <option value="allkeys-lfu">allkey=lfu</option>
            <option value="volatile-lfu">volatile-lfu</option>
            <option value="volatile-random">voltile-random</option>
            <option value="allkeys-random">allkey-random</option>
          </select>
          <button type="submit" className="">
            submit config
          </button>
        </div>
      </div>
    </form>
  );
};

export default RedisForm;
