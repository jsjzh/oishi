import { GetMyAssetDetails } from './service';
import fs from 'fs-extra';
import moment from 'moment';

GetMyAssetDetails.then(data => {
  console.log(data);
});
