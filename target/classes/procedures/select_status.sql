CREATE OR REPLACE FUNCTION audit.select_status(pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
    OPEN po_cursor FOR
    SELECT  usr.b_overdue_fees AS enabled,
            con.b_hide_from_dlt  AS b_hide_from_dlt
      FROM public.box_profile box
        LEFT JOIN public.config_receiver con ON con.i_mid_id = box.i_mid_id
        LEFT JOIN public.user_profile usr ON usr.i_user_id = box.i_user_id
      WHERE box.i_mid_id = pi_mid::NUMERIC;
  RETURN po_cursor;
END
$function$
