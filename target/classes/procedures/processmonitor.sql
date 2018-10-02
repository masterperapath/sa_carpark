CREATE OR REPLACE FUNCTION audit.processmonitor()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_get_rowcount NUMERIC;
BEGIN
  CREATE TEMP TABLE monitor_tmp ON COMMIT DROP AS
  WITH x_server AS (
    SELECT
      CASE WHEN SUM(PostVmsFishers) > 0 THEN 'OK' ELSE 'ERROR' END AS PostVmsFishers,
      CASE WHEN SUM(gpsiam) > 0 THEN 'OK' ELSE 'ERROR' END AS gpsiam,
      CASE WHEN SUM(TTFT) > 0 THEN 'OK' ELSE 'ERROR' END AS TTFT,
      CASE WHEN SUM(PostgpsdatatoDLT) > 0 THEN 'OK' ELSE 'ERROR' END AS PostgpsdatatoDLT,
      CASE WHEN SUM(postDataToEocTrack) > 0 THEN 'OK' ELSE 'ERROR' END AS postDataToEocTrack,
      CASE WHEN SUM(postSCGSoap) > 0 THEN 'OK' ELSE 'ERROR' END AS postSCGSoap,
      CASE WHEN SUM(postGpsDataToSchenker) > 0 THEN 'OK' ELSE 'ERROR' END AS postGpsDataToSchenker,
      CASE WHEN SUM(postDataToSCCC) > 0 THEN 'OK' ELSE 'ERROR' END AS postDataToSCCC
    FROM (
      SELECT
        CASE id WHEN 11 THEN (CASE WHEN '10 minute' :: INTERVAL < (NOW() - TO_TIMESTAMP(var1 / 1000)) THEN 0 ELSE 1 END) END AS TTFT,
        CASE id WHEN 12 THEN (CASE WHEN '10 minute' :: INTERVAL < (NOW() - TO_TIMESTAMP(var1 / 1000)) THEN 0 ELSE 1 END) END AS gpsiam,
        CASE id WHEN 13 THEN (CASE WHEN '60 minute' :: INTERVAL < (NOW() - TO_TIMESTAMP(var1 / 1000)) THEN 0 ELSE 1 END) END AS PostVmsFishers ,
        CASE id WHEN 14 THEN (CASE WHEN '10 minute' :: INTERVAL < (NOW() - TO_TIMESTAMP(var1 / 1000)) THEN 0 ELSE 1 END) END AS PostgpsdatatoDLT,
        CASE id WHEN 25 THEN (CASE WHEN '30 minute' :: INTERVAL < (NOW() - TO_TIMESTAMP(var1 / 1000)) THEN 0 ELSE 1 END) END AS postDataToEocTrack,
        CASE id WHEN 26 THEN (CASE WHEN '30 minute' :: INTERVAL < (NOW() - TO_TIMESTAMP(var1 / 1000)) THEN 0 ELSE 1 END) END AS postSCGSoap,
        CASE id WHEN 27 THEN (CASE WHEN '30 minute' :: INTERVAL < (NOW() - TO_TIMESTAMP(var1 / 1000)) THEN 0 ELSE 1 END) END AS postGpsDataToSchenker,
        CASE id WHEN 28 THEN (CASE WHEN '10 minute' :: INTERVAL < (NOW() - TO_TIMESTAMP(var1 / 1000)) THEN 0 ELSE 1 END) END AS postDataToSCCC
      FROM x_server
      WHERE id IN (11, 12, 13, 14, 25, 26, 27,28)
    ) a
  ), livedata AS (
    SELECT
      (CASE WHEN SUM(CASE WHEN NOW() - '1 hour' :: INTERVAL < ts_keepalive AND i_mid_id BETWEEN 14000 AND 15000 THEN 1 ELSE 0 END) < 150 THEN 'ERROR' ELSE 'OK' END) AS pingCheckVMS,
      SUM( CASE WHEN ts_gprsdate > (NOW() - '5 minute' :: INTERVAL ) THEN 1 ELSE 0 END ) AS "online",
      SUM( CASE WHEN ts_gprsdate <= (NOW() - '5 minute' :: INTERVAL ) AND ts_gprsdate > (NOW() - '15 minute' :: INTERVAL ) THEN 1 ELSE 0 END ) AS ">5min",
      SUM( CASE WHEN ts_gprsdate <= (NOW() - '15 minute' :: INTERVAL ) AND ts_gprsdate > (NOW() - '60 minute' :: INTERVAL ) THEN 1 ELSE 0 END ) AS ">15min",
      SUM( CASE WHEN ts_gprsdate <= (NOW() - '60 minute' :: INTERVAL ) AND ts_gprsdate > (NOW() - '1 DAY' :: INTERVAL ) THEN 1 ELSE 0 END ) AS ">60min",
      SUM( CASE WHEN ts_gprsdate <= (NOW() - '1 DAY' :: INTERVAL ) AND ts_gprsdate > (NOW() - '7 DAY' :: INTERVAL ) THEN 1 ELSE 0 END ) AS ">1Day",
      SUM( CASE WHEN ts_gprsdate <= (NOW() - '7 DAY' :: INTERVAL ) AND ts_gprsdate > (NOW() - '30 DAY' :: INTERVAL ) THEN 1 ELSE 0 END ) AS ">7Day",
      SUM( CASE WHEN ts_gprsdate <= (NOW() - '30 DAY' :: INTERVAL ) AND ts_gprsdate > (NOW() - '90 DAY' :: INTERVAL ) THEN 1 ELSE 0 END ) AS ">30Day",
      SUM( CASE WHEN ts_gprsdate <= (NOW() - '90 DAY' :: INTERVAL ) AND ts_gprsdate > (NOW() - '180 DAY' :: INTERVAL ) THEN 1 ELSE 0 END ) AS ">90Day",
      SUM( CASE WHEN ts_gprsdate <= (NOW() - '180 DAY' :: INTERVAL ) AND ts_gprsdate > (NOW() - '360 DAY' :: INTERVAL ) THEN 1 ELSE 0 END ) AS ">180Day",
      SUM( CASE WHEN ts_gprsdate <= (NOW() - '360 DAY' :: INTERVAL ) THEN 1 ELSE 0 END ) AS ">360Day",
      NOW()::TIMESTAMP AS create_date
    FROM livedata live
    WHERE  live.i_mid_id BETWEEN 0 AND 888000
      AND ts_gprsdate IS NOT NULL
  ), pg_stat AS (
--    SELECT COUNT(1) AS lock_table,
--        ARRAY_TO_STRING(ARRAY_AGG(query), ',') AS lock_statement
--   FROM pg_stat_activity
-- WHERE 1 waiting = TRUE
	SELECT 0 AS lock_table, '' AS lock_statement
  ),user_login as (
  SELECT COUNT(1) AS userLogin
 FROM pg_stat_activity
  )
  ,row_count_livedata as (
  	SELECT reltuples::NUMERIC AS rowCountLiveData 
  	FROM pg_class 
  	where relname='livedata'
  )
  SELECT TTFT ,gpsiam ,PostVmsFishers ,postSCGSoap ,postGpsDataToSchenker
    ,postDataToEocTrack ,PostgpsdatatoDLT ,userLogin ,lock_table ,lock_statement, PingCheckVMS
    ,postDataToSCCC ,online ,">5min" ,">15min" ,">60min" ,">1Day"
    ,">7Day" ,">30Day" ,">90Day" ,">180Day" ,">360Day"
    ,create_date, rowCountLiveData
  FROM x_server
    JOIN pg_stat ON 1 = 1
    JOIN user_login ON 1 = 1
    JOIN livedata ON 1 = 1
   	JOIN row_count_livedata ON 1 = 1;

  UPDATE audit.monitor_lastest
  SET ttft_stat = mntmp.TTFT
    ,vms_stat = mntmp.PostVmsFishers
    ,scg_stat = mntmp.postSCGSoap
    ,schenker_stat = mntmp.postGpsDataToSchenker
    ,eoc_stat = mntmp.postDataToEocTrack
    ,dlt_stat = mntmp.PostgpsdatatoDLT
    ,lock_table = mntmp.lock_table
    ,skywave_stat = mntmp.PingCheckVMS
    ,box_online = mntmp.online
    ,box_online_5min = mntmp.">5min"
    ,box_online_15min = mntmp.">15min"
    ,box_online_60min = mntmp.">60min"
    ,box_online_1day = mntmp.">1Day"
    ,box_online_7day = mntmp.">7Day"
    ,box_online_30day = mntmp.">30Day"
    ,box_online_90day = mntmp.">90Day"
    ,box_online_180day = mntmp.">180Day"
    ,box_online_360day = mntmp.">360Day"
    ,created_date = mntmp.create_date
    ,gpsiam_stat = mntmp.gpsiam
    ,user_login_database = mntmp.userLogin
    ,sccc_stat = mntmp.postDataToSCCC
    ,lock_statement = mntmp.lock_statement
    ,row_count_live = mntmp.rowCountLiveData
  FROM monitor_tmp mntmp;

  GET DIAGNOSTICS v_get_rowcount = ROW_COUNT;

  IF v_get_rowcount = 0 THEN
    INSERT INTO audit.monitor_lastest
    SELECT TTFT ,PostVmsFishers ,postSCGSoap ,postGpsDataToSchenker
      ,postDataToEocTrack ,PostgpsdatatoDLT ,lock_table ,PingCheckVMS
      ,online ,">5min" ,">15min" ,">60min" ,">1Day"
      ,">7Day" ,">30Day" ,">90Day" ,">180Day" ,">360Day"
      ,create_date ,gpsiam ,userLogin ,postDataToSCCC, lock_statement, row_count_live
    FROM monitor_tmp;
  END IF;

--  INSERT  INTO audit.monitor
--  SELECT NEXTVAL('audit.monitor_id_seq'::REGCLASS), TTFT ,PostVmsFishers ,postSCGSoap ,postGpsDataToSchenker
--    ,postDataToEocTrack ,PostgpsdatatoDLT ,lock_table ,PingCheckVMS
--    ,">5min" ,">15min" ,">60min" ,">1Day"
--    ,">7Day" ,">30Day" ,">90Day" ,">180Day" ,">360Day"
--    ,create_date ,gpsiam ,userLogin ,postDataToSCCC, lock_statement, online, row_count_live 
--  FROM monitor_tmp
--  LIMIT 1;

END;
$function$
