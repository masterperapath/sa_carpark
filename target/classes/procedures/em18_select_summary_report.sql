CREATE OR REPLACE FUNCTION audit.em18_select_summary_report(pi_start_date character varying, pi_end_date character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_sql                       VARCHAR(32000);
  po_cursor                   REFCURSOR;
BEGIN
	OPEN po_cursor FOR
	 SELECT 
	       grp.i_group_id AS "Group"
		 , box.i_mid_id AS "MID"
		 , COALESCE(box.c_plate_number,'-') AS "ทะเบียน"
		 , COALESCE(c_car_code,'-') AS "ชื่อเรียกรถ"
		 , COALESCE(grp.c_group_name,'-')  AS "ลูกค้า"
		 , COALESCE(c_comment,'-')  AS "Comment"
		 , COALESCE(to_char(dt_install, 'yyyy-MM-dd'),'-')  AS "วันที่ติดตั้ง"
		 , COALESCE(c_technician,'-')  AS "ช่างติดตั้ง"
		 , CASE WHEN b_card_reader THEN 'รูดบัตร' ELSE '-' END  AS "รายละอียด"
		 , CASE WHEN b_card_reader THEN 'ออกเอกสารแล้ว' ELSE '-' END  AS "ออกใบรับรองรูดบัตร"
		 , COALESCE(dlt.dt_printed::VARCHAR,'-')  AS "วันที่ปริ๊นเอกสาร"
	  FROM box_profile box
	  INNER JOIN group_profile grp ON box.i_group_id = grp.i_group_id
	  FULL OUTER JOIN dlt_regis_info dlt ON dlt.i_mid_id =  box.i_mid_id
	  WHERE (box.dt_install >= pi_start_date::TIMESTAMP AND box.dt_install <= pi_end_date::TIMESTAMP + '1 day'::interval)
	  AND grp.i_group_id NOT IN (133, 330 ,353, 351, 5066)
	  ORDER BY box.dt_install, grp.i_group_id ;

  RETURN po_cursor;
END
$function$
