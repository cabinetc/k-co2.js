/**
 * Return an estimate of the carbon emissions produced by a page view.
 * @link https://developers.thegreenwebfoundation.org/co2js/overview/
 */

import { co2, hosting, averageIntensity } from '@tgwf/co2';

(() => {

  window.addEventListener('load', () => {

    /**
     * Check whether the current domain is served from a green web host.
     * https://developers.thegreenwebfoundation.org/co2js/tutorials/check-hosting/
     */

    const domain = window.location.hostname;
    hosting.check(domain).then((result) => {

      const isGreenHost = result;
      const emissions = new co2();

      /**
       * 1. Get average grid intensity data for all countries.
       * 2. Set the country in which the hosting server is located.
       * 3. Use average grid intensity data for the origin country.
       */

      const { data } = averageIntensity; /* 1 */
      const origin = data.BEL; /* 2 */
      const options = {
        gridIntensity: {
          dataCenter: origin /* 3 */
        }
      };

      /**
       * Iterate the array of `PerformanceEntry` objects and calculate the total
       * number of transferred bytes.
       * @link https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntries
       */

      let transferredBytes = 0;
      let results = [];

      let entries = performance.getEntries();
      entries = entries.filter(entry => 'transferSize' in entry);

      entries.forEach((entry) => {
        transferredBytes = parseInt(transferredBytes + entry.transferSize);
        results.push({
          name: entry.name,
          transferSize: entry.transferSize
        });
      });

      results.sort((a, b) => b.transferSize - a.transferSize);

      /**
       * Estimate carbon emissions for the current page view and log the data
       * in the console.
       */

      const estimate = emissions.perVisitTrace(transferredBytes, isGreenHost, options);
      const grams = estimate.co2.toFixed(3);
      const notice = `${results.length} requests emitted an estimated ${grams} grams of CO2. ${transferredBytes} bytes were transferred.`;

      console.log(notice);
    });
  });
})();
