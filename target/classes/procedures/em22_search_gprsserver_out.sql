CREATE OR REPLACE FUNCTION audit.em22_search_gprsserver_out(pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
	 OPEN po_cursor FOR
	      SELECT recipient as mid ,CASE message
                WHEN 'F01' THEN 'clear cache sms'
                WHEN 'F02' THEN 'clear cache gprs'
                WHEN 'F09,1' THEN 'clear sms ข้อมูลของกล่องที่ส่งข้อมูลย้อนหลัง'
                WHEN 'F09,2' THEN 'clear gprs ข้อมูลของกล่องที่ส่งข้อมูลย้อนหลัง'
                WHEN 'F09,3' THEN 'clear sms and gprs ข้อมูลของกล่องที่ส่งข้อมูลย้อนหลัง'
                ELSE message
                END AS command, status
                , COALESCE(TO_CHAR(create_date, 'DD/MM/YYYY HH24:MI:SS'),'-')  AS create_date
			FROM gprsserver_out
			WHERE recipient = pi_mid::NUMERIC
	    ORDER BY create_date DESC;
  RETURN po_cursor;
END
$function$
