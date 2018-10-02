CREATE OR REPLACE FUNCTION audit.em31_select_imei_by_mid(pi_mid NUMERIC)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
	
    OPEN po_cursor FOR
		SELECT ROW_NUMBER() OVER(ORDER BY update_date) AS No, sb_mid_cuurent, sb_imei_cuurent, sb_mid_target, sb_imei_target, sb_mid_swap, sb_imei_swap, update_name, COALESCE(TO_CHAR(update_date, 'DD/MM/YYYY HH24:MI:SS'),'-')  AS update_date  
		FROM audit.history_swap_box_2
		WHERE sb_mid_cuurent = pi_mid;
  	RETURN po_cursor;
    
END;
$function$