<template>

  <div class="common-layout">

  <!--定义面包屑样式-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item>系统相关</el-breadcrumb-item>
    <el-breadcrumb-item>关于我们</el-breadcrumb-item>
  </el-breadcrumb>
  <h1>关于我们</h1>

    <el-container>
      <el-header height="100%">
        <div class="common-layout">
          <el-container direction="horizontal">
            <el-aside>
              <el-image :src="systemAboutIconUrl">
              </el-image>
            </el-aside>

            <el-main>
              <el-divider content-position="left"><h3>我们是谁：</h3></el-divider>
              <h3>西安交通大学人工智能与机器人研究所（人工智能学院）</h3>

              <el-divider content-position="left"><h3>我们的愿景：</h3></el-divider>
              <h3>成为人工智能领域的开拓者和引领者</h3>

              <el-divider content-position="left"><h3>我们的使命</h3></el-divider>
              <h3>让我们拥有适应、改变和创造未来世界的人工智能</h3>


            </el-main>
          </el-container>
        </div>
      </el-header>

      <!--系统关于页面介绍详情-->
      <el-main style="margin-top: 20px;text-align: center;">
        <el-divider content-position="left"><h3>一、发展历程</h3></el-divider>
        <p>1958年西安交通大学在国内首批创建“自动控制”专业，1981年首批获得“控制科学与工程”硕士和一级学科博士授予权，1982年设立“模式识别与智能系统”二级学科（2001年被评为全国重点学科）。1986年在国内最早成立了人工智能专职研究机构——“人工智能与机器人研究所”（以下简称人机所），依托“模式识别与智能系统”二级学科，开展人工智能方面的教学、科研和高层次人才培养工作，已成为西安交通大学培养高层次人才的重要基地。</p>
        <p>为满足国家重大战略需求，服务国家和地方社会经济发展，紧抓人工智能发展的重大历史机遇，充分发挥我校在人工智能方向上学科发展和人才培养优势，加快人工智能创新人才培养，2017年由我国人工智能权威专家、中国工程院院士郑南宁教授领衔，创办了“人工智能拔尖人才培养试验班”探索培养人工智能方向本科生，并于2018年招收第一届本科生。2018年12月在人机所的基础上成立“人工智能学院”，2019年3月获教育部首批“人工智能”本科新专业建设资格。</p>
        <el-divider content-position="left"><h3>二、师资队伍</h3></el-divider>
        <p>拥有一支能力突出、结构合理的高水平教学科研团队，现有教授和副教授24人、研究员和高工等实验技术人员6人、讲师1人、行政事务秘书3人，其中中国工程院院士1人、IEEE Fellow 4人、“国家级领军人才”2人、“科技创新领军人才”1人、“国家级青年人才”1人、国家优秀青年科学基金获得者1人、中国科协青年人才托举工程入选者2人、3位“教育部新世纪优秀人才”。该团队于2000年获国家自然基金委员会“创新研究群体科学基金”首批资助，并获连续资助。</p>
        <el-divider content-position="left"><h3>三、人才培养</h3></el-divider>
        <p>在30余年的发展过程中，人机所逐步形成了独特的育人文化和制度，取得了一批在国内外具有重大影响的成果，培养了一批学术界和产业界的领军人才，成为高水平创新人才培养的重要基地。特别是，培养出国际人工智能领域45岁以下顶尖科学家、前微软亚洲研究院首席研究员、现任旷视科技首席科学家孙剑博士，其提出的“深度残差网络ResNets”成功地解决了深度神经网络训练难的世界级难题，成为国际图像识别领域的重大突破和深度学习技术发展的重要里程碑。</p>
        <p>人工智能本科专业旨在培养扎实掌握人工智能基础理论、基本方法和应用技术，熟悉人工智能相关交叉学科知识，具备突出的科学素养、创新能力、系统思维能力与国际视野，未来能在我国人工智能技术与产业发展中发挥领军作用，并有潜力成为国际一流工程师、科学家和企业家的优秀拔尖人才。2018年10月发布了“西安交大2018版人工智能本科专业课程设置”，形成了包括数学与统计、科学与工程、人工智能核心、计算机科学核心、认知与神经科学、人工智能与社会、先进机器人学以及人工智能平台与工具的8个专业课程群，每个课程群由若干门必修课和选修课组成，多门课程采取多主题（Topic）授课方式。来自校内人工智能学院、自动化学院、计算机学院、电气学院、经金学院、医学院、人文学院等院系的教师，马耳他大学、南京大学、陕西师范大学、中科院自动化所、中科院沈自所、微软亚洲研究院、旷视科技等国内外高校和科研机构的特聘教授和人工智能企业的顶级专家将组成实力雄厚的教学团队。此外，海外杰出科学家也将以短期讲学讲座等多种方式参与教学。</p>
        <el-divider content-position="left"><h3>四、科学研究</h3></el-divider>
        <p>在科学研究方面，主要进行以计算机视觉与模式识别为基础的智能信息处理结合学科发展前沿，重点进行视觉信号统计特性、初级视觉模型、计算机图形学和机器视觉信息计算模型研究；智能系统的数理机制探索与模型化；计算视频及面向图像和视频处理的超大规模专用集成电路设计；基于图像信息的智能控制与识别系统和各种图像处理方法与技术。承担国家级科技项目、省部级科技项目、企业委托项目200余项；荣获国家自然科学奖二等奖1项，国家技术发明奖二等奖1项，国家科技进步奖二等奖2项；获省部级科技奖励一等奖３项，获中国青年科技奖2人，以及IEEE智能交通系统杰出团队奖等奖励。</p>
        <p>在2017年“中国智能车未来挑战赛”中，“发现号”无人驾驶智能车城乡道路测试、高架快速道路测试两个单项均获第一名，综合排名第一。在2018年“中国智能车未来挑战赛”中，“Pioneer先锋号”无人驾驶智能车获得高架快速道路测试和城乡道路环境测试的总分第一名，并荣获高速道路施工路段自主通行技术奖第一名、城区道路自主泊车技术奖第一名和乡村道路行驶技术奖第三名。</p>
        <p>人工智能学院继续秉承和发扬人机所30余年的发展过程中形成的独特的科研和人才培养优势，立足国家发展全局，聚焦人工智能重大科学前沿问题和应用基础理论瓶颈，重视面向国家重大需求的研究和应用，加强多学科的深度交叉融合，并重点围绕如何设计更加健壮的人工智能、人机协同的混合增强智能、以及人工智能技术的核心芯片与新型计算架构开展系统性的研究，并在新的发展时期进一步做好西迁精神和团队文化传承，为我国人工智能科技水平跻身世界前列，为加快建设创新型国家和世界科技强国做出更大的贡献。</p>
      </el-main>
    </el-container>

  </div>

</template>

<script>
import {useStore} from 'vuex'
export default {
    name:"SystemAbout",
    setup(){
      const store = useStore()
      //定义系统开发者团队背景变量
      const systemAboutIconUrl = store.state.systemAbout.systemAboutUs.systemAboutUsIconUrl
        return{
          store,
          systemAboutIconUrl,

        }
    }
}
</script>

<style scoped>

.common-layout{
  /*background-image: url("/images/system_about_us_bg.png");*/
  /*background-color: orange;*/
}

.el-header .el-container .el-aside{
  display: flex;
  justify-content: center;
  align-items: center;
}

/*设置p标签中文字靠左，且开头空两格*/
.el-main p{
  margin: 20px;
  text-indent:30px;
  display: inline-block;
  vertical-align: middle;
  text-align: left;
}


</style>
