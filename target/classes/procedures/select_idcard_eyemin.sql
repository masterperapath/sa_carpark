CREATE OR REPLACE FUNCTION audit.select_idcard_eyemin(pi_mid character varying, pi_startdate character varying, pi_enddate character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;

BEGIN

OPEN po_cursor FOR 
SELECT card.i_mid_id , card.c_raw, TO_CHAR(card.ts_gpsdate +'7 HOUR'::INTERVAL, 'DD/MM/YYYY HH24:MI') AS ts_gpsdate, box.c_plate_number 
FROM card_reader card
JOIN box_profile box ON box.i_mid_id = card.i_mid_id
WHERE box.i_mid_id = CAST(pi_mid AS NUMERIC)
AND pi_startdate::TIMESTAMP - '7 HOUR'::INTERVAL <= ts_gpsdate
AND ts_gpsdate <= pi_enddate::TIMESTAMP - '7 HOUR'::INTERVAL
ORDER BY ts_gpsdate DESC ;

  RETURN po_cursor;
END
$function$
