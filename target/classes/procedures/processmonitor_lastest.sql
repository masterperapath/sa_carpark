CREATE OR REPLACE FUNCTION audit.processmonitor_lastest()
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_sql                       VARCHAR(32000);
  po_cursor                   REFCURSOR;
BEGIN
  OPEN po_cursor FOR 
  SELECT ttft_stat, vms_stat, scg_stat, schenker_stat, eoc_stat, dlt_stat, lock_table, skywave_stat, box_online, 
		 box_online_5min, box_online_15min, box_online_60min, box_online_1day, box_online_7day, box_online_30day,
		 box_online_90day, box_online_180day, box_online_360day, created_date, gpsiam_stat, user_login_database ,sccc_stat, lock_statement, row_count_live
  FROM audit.monitor_lastest;

  RETURN po_cursor;
END
$function$
